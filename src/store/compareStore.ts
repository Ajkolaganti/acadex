import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CompareItem, Program } from '@/types';

interface CompareState {
  items: CompareItem[];
  isOpen: boolean;

  addToCompare: (program: Program) => void;
  removeFromCompare: (programId: string) => void;
  clearCompare: () => void;
  toggleCompareDrawer: () => void;
  openCompareDrawer: () => void;
  closeCompareDrawer: () => void;
  isProgramInCompare: (programId: string) => boolean;
  canAddMore: () => boolean;
}

const MAX_COMPARE_ITEMS = 4;

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addToCompare: (program: Program) => {
        const { items } = get();

        // Check if already in compare
        if (items.some(item => item.program.id === program.id)) {
          return;
        }

        // Check if at max capacity
        if (items.length >= MAX_COMPARE_ITEMS) {
          return;
        }

        const newItem: CompareItem = {
          program,
          added_at: new Date().toISOString()
        };

        set({
          items: [...items, newItem],
          isOpen: true
        });
      },

      removeFromCompare: (programId: string) => {
        const { items } = get();
        const newItems = items.filter(item => item.program.id !== programId);

        set({
          items: newItems,
          isOpen: newItems.length > 0
        });
      },

      clearCompare: () => {
        set({
          items: [],
          isOpen: false
        });
      },

      toggleCompareDrawer: () => {
        const { isOpen } = get();
        set({ isOpen: !isOpen });
      },

      openCompareDrawer: () => {
        set({ isOpen: true });
      },

      closeCompareDrawer: () => {
        set({ isOpen: false });
      },

      isProgramInCompare: (programId: string) => {
        const { items } = get();
        return items.some(item => item.program.id === programId);
      },

      canAddMore: () => {
        const { items } = get();
        return items.length < MAX_COMPARE_ITEMS;
      }
    }),
    {
      name: 'compare-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items
      })
    }
  )
);