import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ShortlistItem, Program } from '@/types';
import { api } from '@/lib/apiWrapper';

interface ShortlistState {
  items: ShortlistItem[];
  isLoading: boolean;
  error: string | null;

  loadShortlist: () => Promise<void>;
  addToShortlist: (program: Program, notes?: string, tags?: string[]) => Promise<void>;
  removeFromShortlist: (itemId: string) => Promise<void>;
  updateShortlistItem: (itemId: string, updates: { notes?: string; tags?: string[] }) => Promise<void>;
  isProgramInShortlist: (programId: string) => boolean;
  clearError: () => void;

  // Local storage methods for non-authenticated users
  addToLocalShortlist: (program: Program, notes?: string, tags?: string[]) => void;
  removeFromLocalShortlist: (programId: string) => void;
  updateLocalShortlistItem: (programId: string, updates: { notes?: string; tags?: string[] }) => void;
  syncLocalToServer: () => Promise<void>;
}

export const useShortlistStore = create<ShortlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,

      loadShortlist: async () => {
        set({ isLoading: true, error: null });
        try {
          const items = await api.getShortlist();
          set({ items, isLoading: false });
        } catch (error: any) {
          // If user is not authenticated, use local storage items
          set({ isLoading: false });
        }
      },

      addToShortlist: async (program: Program, notes?: string, tags?: string[]) => {
        const { items } = get();

        // Check if already in shortlist
        if (items.some(item => item.program.id === program.id)) {
          return;
        }

        try {
          const newItem = await api.addToShortlist(program.id, notes, tags);
          set({ items: [...items, newItem] });
        } catch (error: any) {
          // If API fails (e.g., not authenticated), add to local storage
          get().addToLocalShortlist(program, notes, tags);
        }
      },

      removeFromShortlist: async (itemId: string) => {
        const { items } = get();

        try {
          await api.removeFromShortlist(itemId);
          set({ items: items.filter(item => item.id !== itemId) });
        } catch (error: any) {
          // For local items, itemId is actually programId
          get().removeFromLocalShortlist(itemId);
        }
      },

      updateShortlistItem: async (itemId: string, updates: { notes?: string; tags?: string[] }) => {
        const { items } = get();

        try {
          const updatedItem = await api.updateShortlistItem(itemId, updates);
          set({
            items: items.map(item =>
              item.id === itemId ? updatedItem : item
            )
          });
        } catch (error: any) {
          // For local items
          get().updateLocalShortlistItem(itemId, updates);
        }
      },

      isProgramInShortlist: (programId: string) => {
        const { items } = get();
        return items.some(item => item.program.id === programId);
      },

      clearError: () => set({ error: null }),

      // Local storage methods
      addToLocalShortlist: (program: Program, notes?: string, tags?: string[]) => {
        const { items } = get();

        if (items.some(item => item.program.id === program.id)) {
          return;
        }

        const newItem: ShortlistItem = {
          id: `local-${program.id}`,
          program,
          notes: notes || '',
          tags: tags || [],
          created_at: new Date().toISOString()
        };

        set({ items: [...items, newItem] });
      },

      removeFromLocalShortlist: (programId: string) => {
        const { items } = get();
        set({
          items: items.filter(item =>
            item.program.id !== programId && item.id !== programId
          )
        });
      },

      updateLocalShortlistItem: (programId: string, updates: { notes?: string; tags?: string[] }) => {
        const { items } = get();
        set({
          items: items.map(item =>
            (item.program.id === programId || item.id === programId)
              ? { ...item, ...updates }
              : item
          )
        });
      },

      syncLocalToServer: async () => {
        const { items } = get();
        const localItems = items.filter(item => item.id.startsWith('local-'));

        try {
          const serverItems = [];
          for (const localItem of localItems) {
            const serverItem = await api.addToShortlist(
              localItem.program.id,
              localItem.notes,
              localItem.tags
            );
            serverItems.push(serverItem);
          }

          // Replace local items with server items
          const nonLocalItems = items.filter(item => !item.id.startsWith('local-'));
          set({ items: [...nonLocalItems, ...serverItems] });
        } catch (error: any) {
          console.error('Failed to sync shortlist to server:', error);
        }
      }
    }),
    {
      name: 'shortlist-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items.filter(item => item.id.startsWith('local-'))
      })
    }
  )
);