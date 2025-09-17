'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useInView } from 'react-intersection-observer';
import Layout from '@/components/layout/Layout';
import SearchBar from '@/components/home/SearchBar';
import SearchFilters from '@/components/search/SearchFilters';
import ProgramCard from '@/components/programs/ProgramCard';
import { Button } from '@/components/ui/Button';
import { useSearchStore } from '@/store/searchStore';
import { SearchFilters as FiltersType } from '@/types';
import analytics from '@/lib/analytics';
import {
  Filter,
  Grid,
  List,
  SortAsc,
  Loader2,
  Search,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const sortOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'tuition_asc', label: 'Tuition: Low to High' },
  { value: 'tuition_desc', label: 'Tuition: High to Low' },
  { value: 'ranking', label: 'University Ranking' },
  { value: 'deadline', label: 'Application Deadline' }
];

function SearchPageContent() {
  const searchParams = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  const {
    query,
    filters,
    sortBy,
    results,
    total,
    hasNext,
    isLoading,
    error,
    setQuery,
    setFilters,
    setSortBy,
    search,
    loadMore,
    clearError
  } = useSearchStore();

  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  // Initialize search from URL parameters
  useEffect(() => {
    const urlQuery = searchParams.get('q') || '';
    const urlFilters: FiltersType = {};

    // Parse filters from URL
    const countries = searchParams.getAll('country');
    if (countries.length) urlFilters.country = countries;

    const degreeLevels = searchParams.getAll('degree_level');
    if (degreeLevels.length) urlFilters.degree_level = degreeLevels;

    const disciplines = searchParams.getAll('discipline');
    if (disciplines.length) urlFilters.discipline = disciplines;

    const tuitionMin = searchParams.get('tuition_min');
    const tuitionMax = searchParams.get('tuition_max');
    if (tuitionMin || tuitionMax) {
      urlFilters.tuition_range = {
        min: tuitionMin ? parseInt(tuitionMin) : undefined,
        max: tuitionMax ? parseInt(tuitionMax) : undefined
      };
    }

    const ieltsMin = searchParams.get('ielts_min');
    if (ieltsMin) urlFilters.ielts_min = parseFloat(ieltsMin);

    const toeflMin = searchParams.get('toefl_min');
    if (toeflMin) urlFilters.toefl_min = parseInt(toeflMin);

    const scholarships = searchParams.get('scholarships_available');
    if (scholarships) urlFilters.scholarships_available = scholarships === 'true';

    const sortParam = searchParams.get('sort') as any;
    if (sortParam && sortOptions.find(opt => opt.value === sortParam)) {
      setSortBy(sortParam);
    }

    // Update store and trigger search
    if (urlQuery !== query) setQuery(urlQuery);
    setFilters(urlFilters);

    // Trigger search
    search(true);
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-load more when scrolling
  useEffect(() => {
    if (inView && hasNext && !isLoading) {
      loadMore();
    }
  }, [inView, hasNext, isLoading, loadMore]);

  // Handle sort change
  const handleSortChange = useCallback((value: string) => {
    setSortBy(value as any);
    setSortMenuOpen(false);
    search(true);
    analytics.track('search_sorted', { sort_by: value });
  }, [setSortBy, search]);

  // Handle search
  const handleSearch = useCallback(() => {
    search(true);
    analytics.searchSubmitted(query, filters, results.length);
  }, [search, query, filters, results.length]);

  // Close error
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  return (
    <Layout>
      <div className="bg-white shadow-sm border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-2xl mx-auto">
            <SearchBar placeholder="Search programs, universities, or destinations..." showSuggestions={false} />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-8">
              <div className="lg:hidden mb-4">
                <Button
                  variant="secondary"
                  onClick={() => setFiltersOpen(true)}
                  className="w-full justify-between"
                >
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {Object.keys(filters).length} active
                  </span>
                </Button>
              </div>
              <div className="hidden lg:block">
                <SearchFilters isOpen={true} onClose={() => {}} desktop={true} />
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Search Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {query ? `Search results for "${query}"` : 'All Programs'}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {isLoading && results.length === 0 ? (
                    'Searching...'
                  ) : (
                    `${total.toLocaleString()} programs found`
                  )}
                </p>
              </div>

              {/* View and Sort Controls */}
              <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                {/* View Mode Toggle */}
                <div className="flex items-center bg-secondary rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-white text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    aria-label="Grid view"
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded transition-colors ${
                      viewMode === 'list'
                        ? 'bg-white text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    aria-label="List view"
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                  <Button
                    variant="secondary"
                    onClick={() => setSortMenuOpen(!sortMenuOpen)}
                    className="min-w-[160px] justify-between"
                  >
                    <div className="flex items-center">
                      <SortAsc className="h-4 w-4 mr-2" />
                      {sortOptions.find(opt => opt.value === sortBy)?.label}
                    </div>
                  </Button>

                  {sortMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-border rounded-md shadow-lg z-50">
                      <div className="py-1">
                        {sortOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => handleSortChange(option.value)}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-secondary transition-colors ${
                              sortBy === option.value
                                ? 'bg-secondary text-foreground'
                                : 'text-muted-foreground'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Results */}
            {results.length === 0 && !isLoading ? (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No programs found
                </h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search criteria or filters
                </p>
                <Button variant="secondary" onClick={() => window.location.reload()}>
                  Reset Search
                </Button>
              </div>
            ) : (
              <>
                <div className={`
                  ${viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                    : 'space-y-4'
                  }
                `}>
                  {results.map((program) => (
                    <ProgramCard
                      key={program.id}
                      program={program}
                      compact={viewMode === 'list'}
                    />
                  ))}
                </div>

                {/* Loading More */}
                {hasNext && (
                  <div ref={loadMoreRef} className="mt-8 text-center">
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        <span className="text-muted-foreground">Loading more programs...</span>
                      </div>
                    ) : (
                      <Button onClick={loadMore} variant="secondary">
                        Load More Programs
                      </Button>
                    )}
                  </div>
                )}

                {/* End of Results */}
                {!hasNext && results.length > 0 && (
                  <div className="mt-8 text-center text-muted-foreground">
                    <p>You&apos;ve seen all {total} programs</p>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters */}
      <SearchFilters isOpen={filtersOpen} onClose={() => setFiltersOpen(false)} />

      {/* Click outside to close sort menu */}
      {sortMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setSortMenuOpen(false)}
        />
      )}
    </Layout>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}