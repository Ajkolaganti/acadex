'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useSearchStore } from '@/store/searchStore';
import analytics from '@/lib/analytics';
import { cn } from '@/lib/utils';
import { Search, Globe, GraduationCap, BookOpen, ArrowRight } from 'lucide-react';

const searchSuggestions = [
  { icon: GraduationCap, text: 'Computer Science Masters', query: 'computer science', filters: { degree_level: ['master'] } },
  { icon: BookOpen, text: 'MBA Programs', query: 'MBA', filters: { degree_level: ['master'] } },
  { icon: Globe, text: 'Study in USA', query: '', filters: { country: ['United States'] } },
  { icon: Search, text: 'Engineering PhD', query: 'engineering', filters: { degree_level: ['phd'] } },
];

interface SearchBarProps {
  placeholder?: string;
  showSuggestions?: boolean;
  size?: 'default' | 'large';
}

export default function SearchBar({
  placeholder = 'Search programs, universities, or destinations...',
  showSuggestions = true,
  size = 'default'
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setQuery: setSearchQuery, setFilters, search } = useSearchStore();

  const handleSearch = async (searchQuery: string = query, searchFilters: any = {}) => {
    if (!searchQuery.trim() && Object.keys(searchFilters).length === 0) return;

    setIsLoading(true);

    try {
      setSearchQuery(searchQuery);
      if (Object.keys(searchFilters).length > 0) {
        setFilters(searchFilters);
      }

      // Track analytics
      analytics.searchSubmitted(searchQuery, searchFilters, 0);

      // Navigate to search results
      const searchParams = new URLSearchParams();
      if (searchQuery.trim()) {
        searchParams.set('q', searchQuery.trim());
      }

      // Add filters to URL
      if (searchFilters.country?.length) {
        searchFilters.country.forEach((c: string) => searchParams.append('country', c));
      }
      if (searchFilters.degree_level?.length) {
        searchFilters.degree_level.forEach((d: string) => searchParams.append('degree_level', d));
      }
      if (searchFilters.discipline?.length) {
        searchFilters.discipline.forEach((d: string) => searchParams.append('discipline', d));
      }

      router.push(`/search?${searchParams.toString()}`);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: typeof searchSuggestions[0]) => {
    handleSearch(suggestion.query, suggestion.filters);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const inputSize = size === 'large' ? 'lg' : 'md';

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.form
        onSubmit={handleSubmit}
        className="relative"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative glass-card rounded-2xl p-2 shadow-lg">
          <div className="relative flex items-center">
            <div className="absolute left-4 z-10">
              <Search className="h-5 w-5 text-gray-500" />
            </div>

            <input
              type="text"
              placeholder={placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={cn(
                "w-full bg-transparent border-none outline-none pl-12 pr-32 text-gray-700 placeholder-gray-500",
                size === 'large' ? 'h-14 text-lg' : 'h-12 text-base'
              )}
              aria-label="Search for programs and universities"
            />

            <motion.button
              type="submit"
              disabled={isLoading}
              className={cn(
                "absolute right-2 btn-modern px-6 py-2 flex items-center gap-2",
                size === 'large' ? 'h-10' : 'h-8',
                isLoading && 'opacity-50 cursor-not-allowed'
              )}
              whileHover={{ scale: isLoading ? 1 : 1.05 }}
              whileTap={{ scale: isLoading ? 1 : 0.95 }}
              aria-label="Search"
            >
              {isLoading ? (
                <motion.div
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <>
                  <span className="hidden sm:inline">Search</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.form>

      {showSuggestions && (
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.p
            className="text-sm text-gray-600 mb-4 text-center font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            ✨ Popular searches:
          </motion.p>
          <div className="flex flex-wrap gap-3 justify-center">
            {searchSuggestions.map((suggestion, index) => {
              const Icon = suggestion.icon;
              return (
                <motion.button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="glass-button inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:text-blue-600 transition-all duration-300 hover:scale-105"
                  aria-label={`Search for ${suggestion.text}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {suggestion.text}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}