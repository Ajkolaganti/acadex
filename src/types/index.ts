export interface University {
  id: string;
  name: string;
  slug: string;
  country: string;
  city: string;
  logo?: string;
  images: string[];
  ranking?: {
    world?: number;
    national?: number;
    source?: string;
  };
  website: string;
  established?: number;
  description: string;
}

export interface Program {
  id: string;
  title: string;
  slug: string;
  university: University;
  degree_level: 'bachelor' | 'master' | 'phd' | 'diploma' | 'certificate';
  discipline: string;
  duration_months: number;
  tuition_usd: number;
  currency: string;
  location: {
    city: string;
    country: string;
    campus?: string;
  };
  intakes: string[];
  entry_requirements: {
    academic: string[];
    language: {
      ielts_min?: number;
      toefl_min?: number;
      other?: string[];
    };
    other?: string[];
  };
  application_deadline?: string;
  scholarships_available: boolean;
  acceptance_rate?: number;
  description: string;
  highlights: string[];
  similar_programs?: string[];
  created_at: string;
  updated_at: string;
}

export interface SearchFilters {
  country?: string[];
  degree_level?: string[];
  discipline?: string[];
  tuition_range?: {
    min?: number;
    max?: number;
  };
  ielts_min?: number;
  toefl_min?: number;
  application_deadline?: string;
  scholarships_available?: boolean;
  duration_months?: {
    min?: number;
    max?: number;
  };
}

export interface SearchParams {
  query?: string;
  filters: SearchFilters;
  sort_by?: 'relevance' | 'tuition_asc' | 'tuition_desc' | 'ranking' | 'deadline';
  page?: number;
  limit?: number;
}

export interface SearchResult {
  programs: Program[];
  total: number;
  page: number;
  total_pages: number;
  has_next: boolean;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  profile?: UserProfile;
  created_at: string;
}

export interface UserProfile {
  interests: string[];
  budget_usd?: number;
  preferred_countries: string[];
  tests_taken: {
    ielts_score?: number;
    toefl_score?: number;
    gre_score?: number;
    gmat_score?: number;
    sat_score?: number;
  };
  academic_background: {
    highest_degree: string;
    field_of_study: string;
    gpa?: number;
  };
  target_intake?: string;
}

export interface ShortlistItem {
  id: string;
  program: Program;
  notes?: string;
  tags: string[];
  created_at: string;
}

export interface CompareItem {
  program: Program;
  added_at: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  program_references?: {
    id: string;
    title: string;
    university: string;
    url: string;
  }[];
}

export interface LeadFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  country: string;
  interested_programs: string[];
  budget_range?: string;
  target_intake?: string;
  message?: string;
}

export interface AnalyticsEvent {
  event_name: string;
  properties: Record<string, any>;
  timestamp?: string;
}

export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  total_pages: number;
  has_next: boolean;
}

export type FeatureFlags = {
  USE_MOCK_API: boolean;
  ANALYTICS_ENABLED: boolean;
};