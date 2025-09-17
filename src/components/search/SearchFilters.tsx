'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useSearchStore } from '@/store/searchStore';
import { SearchFilters as FiltersType } from '@/types';
import { api } from '@/lib/apiWrapper';
import analytics from '@/lib/analytics';
import {
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  Globe,
  GraduationCap,
  BookOpen,
  DollarSign,
  Calendar,
  Award,
  Clock
} from 'lucide-react';

interface FilterSectionProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function FilterSection({ title, icon: Icon, children, defaultOpen = false }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-between w-full text-left focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
          >
            <div className="flex items-center">
              <Icon className="h-4 w-4 mr-2 text-primary" />
              {title}
            </div>
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </CardTitle>
      </CardHeader>
      {isOpen && (
        <CardContent className="pt-0">
          {children}
        </CardContent>
      )}
    </Card>
  );
}

interface SearchFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  desktop?: boolean;
}

export default function SearchFilters({ isOpen, onClose, desktop = false }: SearchFiltersProps) {
  const { filters, setFilters, clearFilters } = useSearchStore();
  const [countries, setCountries] = useState<string[]>([]);
  const [disciplines, setDisciplines] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const [countriesData, disciplinesData] = await Promise.all([
          api.getCountries(),
          api.getDisciplines()
        ]);
        setCountries(countriesData);
        setDisciplines(disciplinesData);
      } catch (error) {
        console.error('Failed to load filter options:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFilterOptions();
  }, []);

  const handleFilterChange = (key: keyof FiltersType, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters({ [key]: value });
    analytics.filterApplied(key, value);
  };

  const toggleArrayFilter = (key: keyof FiltersType, value: string) => {
    const currentArray = (filters[key] as string[]) || [];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];

    handleFilterChange(key, newArray.length > 0 ? newArray : undefined);
  };

  const handleClearFilters = () => {
    clearFilters();
    analytics.track('filters_cleared', {});
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.country?.length) count += filters.country.length;
    if (filters.degree_level?.length) count += filters.degree_level.length;
    if (filters.discipline?.length) count += filters.discipline.length;
    if (filters.tuition_range?.min || filters.tuition_range?.max) count += 1;
    if (filters.ielts_min) count += 1;
    if (filters.toefl_min) count += 1;
    if (filters.scholarships_available !== undefined) count += 1;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  if (loading) {
    return (
      <div className="w-full max-w-sm bg-white shadow-lg rounded-lg border p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Overlay - only show for mobile version */}
      {!desktop && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}

      {/* Filters Panel */}
      <div className={desktop ?
        'space-y-6' :
        `fixed top-0 left-0 h-full w-full max-w-sm
         bg-white shadow-lg rounded-lg border
         z-50 transform transition-transform duration-300 ease-in-out
         ${isOpen ? 'translate-x-0' : '-translate-x-full'}
         overflow-y-auto lg:hidden`
      }>
        <div className={desktop ? '' : 'p-4'}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6 lg:mb-4">
            <div className="flex items-center">
              <Filter className="h-5 w-5 mr-2 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeFiltersCount}
                  </Badge>
                )}
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Clear all
                </Button>
              )}
              {!desktop && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="lg:hidden"
                  aria-label="Close filters"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Country Filter */}
          <FilterSection title="Country" icon={Globe} defaultOpen>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {countries.slice(0, 12).map((country) => (
                <label key={country} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.country?.includes(country) || false}
                    onChange={() => toggleArrayFilter('country', country)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-foreground">{country}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Degree Level Filter */}
          <FilterSection title="Degree Level" icon={GraduationCap} defaultOpen>
            <div className="space-y-2">
              {['bachelor', 'master', 'phd', 'diploma', 'certificate'].map((level) => (
                <label key={level} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.degree_level?.includes(level) || false}
                    onChange={() => toggleArrayFilter('degree_level', level)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-foreground capitalize">{level}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Discipline Filter */}
          <FilterSection title="Field of Study" icon={BookOpen}>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {disciplines.slice(0, 10).map((discipline) => (
                <label key={discipline} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.discipline?.includes(discipline) || false}
                    onChange={() => toggleArrayFilter('discipline', discipline)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-foreground">{discipline}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Tuition Range Filter */}
          <FilterSection title="Tuition Range (USD)" icon={DollarSign}>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.tuition_range?.min || ''}
                  onChange={(e) => {
                    const min = e.target.value ? parseInt(e.target.value) : undefined;
                    handleFilterChange('tuition_range', {
                      ...filters.tuition_range,
                      min
                    });
                  }}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.tuition_range?.max || ''}
                  onChange={(e) => {
                    const max = e.target.value ? parseInt(e.target.value) : undefined;
                    handleFilterChange('tuition_range', {
                      ...filters.tuition_range,
                      max
                    });
                  }}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Under $20K', min: 0, max: 20000 },
                  { label: '$20K-$40K', min: 20000, max: 40000 },
                  { label: '$40K-$60K', min: 40000, max: 60000 },
                  { label: 'Over $60K', min: 60000, max: undefined }
                ].map((range) => (
                  <button
                    key={range.label}
                    onClick={() => handleFilterChange('tuition_range', {
                      min: range.min,
                      max: range.max
                    })}
                    className="px-3 py-1 text-xs bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </FilterSection>

          {/* Language Requirements */}
          <FilterSection title="Language Requirements" icon={Globe}>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Min IELTS Score
                </label>
                <Input
                  type="number"
                  step="0.5"
                  min="0"
                  max="9"
                  placeholder="e.g., 6.5"
                  value={filters.ielts_min || ''}
                  onChange={(e) => {
                    const value = e.target.value ? parseFloat(e.target.value) : undefined;
                    handleFilterChange('ielts_min', value);
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Min TOEFL Score
                </label>
                <Input
                  type="number"
                  min="0"
                  max="120"
                  placeholder="e.g., 90"
                  value={filters.toefl_min || ''}
                  onChange={(e) => {
                    const value = e.target.value ? parseInt(e.target.value) : undefined;
                    handleFilterChange('toefl_min', value);
                  }}
                />
              </div>
            </div>
          </FilterSection>

          {/* Additional Filters */}
          <FilterSection title="Additional Options" icon={Award}>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.scholarships_available || false}
                  onChange={(e) => {
                    handleFilterChange('scholarships_available', e.target.checked || undefined);
                  }}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-foreground">Scholarships Available</span>
              </label>
            </div>
          </FilterSection>
        </div>
      </div>
    </>
  );
}