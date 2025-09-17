import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SearchFilters, SearchParams, Program, SearchResult } from '@/types';
import { api } from '@/lib/apiWrapper';

interface SearchCache {
  [key: string]: {
    result: SearchResult;
    timestamp: number;
  };
}

interface SearchState {
  filters: SearchFilters;
  query: string;
  sortBy: 'relevance' | 'tuition_asc' | 'tuition_desc' | 'ranking' | 'deadline';
  results: Program[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  isLoading: boolean;
  error: string | null;
  cache: SearchCache;

  setQuery: (query: string) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  setSortBy: (sortBy: 'relevance' | 'tuition_asc' | 'tuition_desc' | 'ranking' | 'deadline') => void;
  search: (resetPage?: boolean) => Promise<void>;
  loadMore: () => Promise<void>;
  clearFilters: () => void;
  clearResults: () => void;
  clearError: () => void;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const createCacheKey = (params: SearchParams): string => {
  return JSON.stringify({
    query: params.query,
    filters: params.filters,
    sort_by: params.sort_by,
    page: params.page
  });
};

const isCacheValid = (timestamp: number): boolean => {
  return Date.now() - timestamp < CACHE_DURATION;
};

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      filters: {},
      query: '',
      sortBy: 'relevance',
      results: [],
      total: 0,
      page: 1,
      totalPages: 0,
      hasNext: false,
      isLoading: false,
      error: null,
      cache: {},

      setQuery: (query: string) => {
        set({ query });
      },

      setFilters: (newFilters: Partial<SearchFilters>) => {
        const currentFilters = get().filters;
        set({
          filters: { ...currentFilters, ...newFilters },
          page: 1
        });
      },

      setSortBy: (sortBy) => {
        set({ sortBy, page: 1 });
      },

      search: async (resetPage = true) => {
        const state = get();
        const searchParams: SearchParams = {
          query: state.query || undefined,
          filters: state.filters,
          sort_by: state.sortBy,
          page: resetPage ? 1 : state.page,
          limit: 12
        };

        const cacheKey = createCacheKey(searchParams);
        const cachedResult = state.cache[cacheKey];

        if (cachedResult && isCacheValid(cachedResult.timestamp)) {
          set({
            results: resetPage ? cachedResult.result.programs : [...state.results, ...cachedResult.result.programs],
            total: cachedResult.result.total,
            page: cachedResult.result.page,
            totalPages: cachedResult.result.total_pages,
            hasNext: cachedResult.result.has_next,
            error: null
          });
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const result = await api.searchPrograms(searchParams);

          set((state) => ({
            results: resetPage ? result.programs : [...state.results, ...result.programs],
            total: result.total,
            page: result.page,
            totalPages: result.total_pages,
            hasNext: result.has_next,
            isLoading: false,
            cache: {
              ...state.cache,
              [cacheKey]: {
                result,
                timestamp: Date.now()
              }
            }
          }));
        } catch (error: any) {
          set({
            error: error.message || 'Search failed',
            isLoading: false
          });
        }
      },

      loadMore: async () => {
        const state = get();
        if (!state.hasNext || state.isLoading) return;

        set({ page: state.page + 1 });
        await get().search(false);
      },

      clearFilters: () => {
        set({
          filters: {},
          query: '',
          sortBy: 'relevance',
          page: 1
        });
      },

      clearResults: () => {
        set({
          results: [],
          total: 0,
          page: 1,
          totalPages: 0,
          hasNext: false,
          error: null
        });
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'search-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        filters: state.filters,
        query: state.query,
        sortBy: state.sortBy,
        cache: state.cache
      })
    }
  )
);