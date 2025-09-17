import {
  Program,
  SearchParams,
  SearchResult,
  User,
  UserProfile,
  ShortlistItem,
  AIMessage,
  LeadFormData,
  ApiResponse,
  PaginatedResponse
} from '@/types';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000/api';
const USE_MOCK_API = process.env.NEXT_PUBLIC_FEATURE_FLAG_USE_MOCK_API === 'true';

class ApiClient {
  private baseUrl: string;
  private headers: HeadersInit;

  constructor() {
    this.baseUrl = API_BASE_URL;
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      headers: this.headers,
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  setAuthToken(token: string) {
    this.headers = {
      ...this.headers,
      'Authorization': `Bearer ${token}`,
    };
  }

  clearAuthToken() {
    const { Authorization, ...rest } = this.headers as any;
    this.headers = rest;
  }

  async searchPrograms(params: SearchParams): Promise<SearchResult> {
    const queryParams = new URLSearchParams();

    if (params.query) queryParams.append('q', params.query);
    if (params.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());

    if (params.filters.country?.length) {
      params.filters.country.forEach(c => queryParams.append('country', c));
    }
    if (params.filters.degree_level?.length) {
      params.filters.degree_level.forEach(d => queryParams.append('degree_level', d));
    }
    if (params.filters.discipline?.length) {
      params.filters.discipline.forEach(d => queryParams.append('discipline', d));
    }
    if (params.filters.tuition_range?.min) {
      queryParams.append('tuition_min', params.filters.tuition_range.min.toString());
    }
    if (params.filters.tuition_range?.max) {
      queryParams.append('tuition_max', params.filters.tuition_range.max.toString());
    }
    if (params.filters.ielts_min) {
      queryParams.append('ielts_min', params.filters.ielts_min.toString());
    }
    if (params.filters.toefl_min) {
      queryParams.append('toefl_min', params.filters.toefl_min.toString());
    }
    if (params.filters.scholarships_available !== undefined) {
      queryParams.append('scholarships_available', params.filters.scholarships_available.toString());
    }

    const response = await this.request<SearchResult>(`/programs/search?${queryParams}`);
    return response.data;
  }

  async getProgram(id: string): Promise<Program> {
    const response = await this.request<Program>(`/programs/${id}`);
    return response.data;
  }

  async getSimilarPrograms(programId: string): Promise<Program[]> {
    const response = await this.request<Program[]>(`/programs/${programId}/similar`);
    return response.data;
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const response = await this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return response.data;
  }

  async register(userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  }): Promise<{ user: User; token: string }> {
    const response = await this.request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.request<User>('/auth/me');
    return response.data;
  }

  async updateUserProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    const response = await this.request<UserProfile>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
    return response.data;
  }

  async getShortlist(): Promise<ShortlistItem[]> {
    const response = await this.request<ShortlistItem[]>('/shortlist');
    return response.data;
  }

  async addToShortlist(programId: string, notes?: string, tags?: string[]): Promise<ShortlistItem> {
    const response = await this.request<ShortlistItem>('/shortlist', {
      method: 'POST',
      body: JSON.stringify({ program_id: programId, notes, tags }),
    });
    return response.data;
  }

  async removeFromShortlist(itemId: string): Promise<void> {
    await this.request(`/shortlist/${itemId}`, {
      method: 'DELETE',
    });
  }

  async updateShortlistItem(itemId: string, updates: { notes?: string; tags?: string[] }): Promise<ShortlistItem> {
    const response = await this.request<ShortlistItem>(`/shortlist/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return response.data;
  }

  async getRecommendations(userProfile?: UserProfile, currentFilters?: any): Promise<Program[]> {
    const response = await this.request<Program[]>('/recommendations', {
      method: 'POST',
      body: JSON.stringify({ user_profile: userProfile, current_filters: currentFilters }),
    });
    return response.data;
  }

  async sendAIMessage(message: string, context?: any): Promise<AIMessage> {
    const response = await this.request<AIMessage>('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, context }),
    });
    return response.data;
  }

  async submitLead(leadData: LeadFormData): Promise<void> {
    await this.request('/leads', {
      method: 'POST',
      body: JSON.stringify(leadData),
    });
  }

  async getCountries(): Promise<string[]> {
    const response = await this.request<string[]>('/metadata/countries');
    return response.data;
  }

  async getDisciplines(): Promise<string[]> {
    const response = await this.request<string[]>('/metadata/disciplines');
    return response.data;
  }

  async getUniversities(country?: string): Promise<{ name: string; slug: string }[]> {
    const queryParams = country ? `?country=${country}` : '';
    const response = await this.request<{ name: string; slug: string }[]>(`/metadata/universities${queryParams}`);
    return response.data;
  }
}

export const apiClient = new ApiClient();

export default apiClient;