import {
  Program,
  SearchParams,
  SearchResult,
  User,
  UserProfile,
  ShortlistItem,
  AIMessage,
  LeadFormData
} from '@/types';

import {
  mockPrograms,
  mockUser,
  mockShortlist,
  mockAIMessages,
  mockCountries,
  mockDisciplines,
  mockUniversities
} from '@/data/mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class MockApiClient {
  private shortlist: ShortlistItem[] = [...mockShortlist];
  private currentUser: User | null = null;
  private authToken: string | null = null;

  async searchPrograms(params: SearchParams): Promise<SearchResult> {
    await delay(500);

    let filteredPrograms = [...mockPrograms];

    if (params.query) {
      const query = params.query.toLowerCase();
      filteredPrograms = filteredPrograms.filter(program =>
        program.title.toLowerCase().includes(query) ||
        program.university.name.toLowerCase().includes(query) ||
        program.discipline.toLowerCase().includes(query)
      );
    }

    if (params.filters.country?.length) {
      filteredPrograms = filteredPrograms.filter(program =>
        params.filters.country!.includes(program.university.country)
      );
    }

    if (params.filters.degree_level?.length) {
      filteredPrograms = filteredPrograms.filter(program =>
        params.filters.degree_level!.includes(program.degree_level)
      );
    }

    if (params.filters.discipline?.length) {
      filteredPrograms = filteredPrograms.filter(program =>
        params.filters.discipline!.includes(program.discipline)
      );
    }

    if (params.filters.tuition_range?.min) {
      filteredPrograms = filteredPrograms.filter(program =>
        program.tuition_usd >= params.filters.tuition_range!.min!
      );
    }

    if (params.filters.tuition_range?.max) {
      filteredPrograms = filteredPrograms.filter(program =>
        program.tuition_usd <= params.filters.tuition_range!.max!
      );
    }

    if (params.sort_by) {
      switch (params.sort_by) {
        case 'tuition_asc':
          filteredPrograms.sort((a, b) => a.tuition_usd - b.tuition_usd);
          break;
        case 'tuition_desc':
          filteredPrograms.sort((a, b) => b.tuition_usd - a.tuition_usd);
          break;
        case 'ranking':
          filteredPrograms.sort((a, b) =>
            (a.university.ranking?.world || 999) - (b.university.ranking?.world || 999)
          );
          break;
      }
    }

    const page = params.page || 1;
    const limit = params.limit || 12;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPrograms = filteredPrograms.slice(startIndex, endIndex);

    return {
      programs: paginatedPrograms,
      total: filteredPrograms.length,
      page,
      total_pages: Math.ceil(filteredPrograms.length / limit),
      has_next: endIndex < filteredPrograms.length
    };
  }

  async getProgram(id: string): Promise<Program> {
    await delay(300);
    const program = mockPrograms.find(p => p.id === id);
    if (!program) {
      throw new Error('Program not found');
    }
    return program;
  }

  async getSimilarPrograms(programId: string): Promise<Program[]> {
    await delay(300);
    const program = mockPrograms.find(p => p.id === programId);
    if (!program || !program.similar_programs) {
      return [];
    }
    return mockPrograms.filter(p => program.similar_programs!.includes(p.id));
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    await delay(800);

    if (email === mockUser.email && password === 'password') {
      this.authToken = 'mock-jwt-token';
      this.currentUser = mockUser;
      return {
        user: mockUser,
        token: this.authToken
      };
    }

    throw new Error('Invalid credentials');
  }

  async register(userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  }): Promise<{ user: User; token: string }> {
    await delay(800);

    const newUser: User = {
      id: `user-${Date.now()}`,
      email: userData.email,
      first_name: userData.first_name,
      last_name: userData.last_name,
      created_at: new Date().toISOString()
    };

    this.authToken = 'mock-jwt-token';
    this.currentUser = newUser;

    return {
      user: newUser,
      token: this.authToken
    };
  }

  async getCurrentUser(): Promise<User> {
    await delay(200);
    if (!this.currentUser) {
      throw new Error('Not authenticated');
    }
    return this.currentUser;
  }

  async updateUserProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    await delay(500);
    if (!this.currentUser) {
      throw new Error('Not authenticated');
    }

    this.currentUser.profile = {
      ...this.currentUser.profile,
      ...profile
    } as UserProfile;

    return this.currentUser.profile;
  }

  async getShortlist(): Promise<ShortlistItem[]> {
    await delay(300);
    if (!this.currentUser) {
      throw new Error('Not authenticated');
    }
    return this.shortlist;
  }

  async addToShortlist(programId: string, notes?: string, tags?: string[]): Promise<ShortlistItem> {
    await delay(400);
    if (!this.currentUser) {
      throw new Error('Not authenticated');
    }

    const program = mockPrograms.find(p => p.id === programId);
    if (!program) {
      throw new Error('Program not found');
    }

    const newItem: ShortlistItem = {
      id: `shortlist-${Date.now()}`,
      program,
      notes: notes || '',
      tags: tags || [],
      created_at: new Date().toISOString()
    };

    this.shortlist.push(newItem);
    return newItem;
  }

  async removeFromShortlist(itemId: string): Promise<void> {
    await delay(300);
    if (!this.currentUser) {
      throw new Error('Not authenticated');
    }

    this.shortlist = this.shortlist.filter(item => item.id !== itemId);
  }

  async updateShortlistItem(itemId: string, updates: { notes?: string; tags?: string[] }): Promise<ShortlistItem> {
    await delay(400);
    if (!this.currentUser) {
      throw new Error('Not authenticated');
    }

    const itemIndex = this.shortlist.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      throw new Error('Shortlist item not found');
    }

    this.shortlist[itemIndex] = {
      ...this.shortlist[itemIndex],
      ...updates
    };

    return this.shortlist[itemIndex];
  }

  async getRecommendations(userProfile?: UserProfile, currentFilters?: any): Promise<Program[]> {
    await delay(600);
    return mockPrograms.slice(0, 3);
  }

  async sendAIMessage(message: string, context?: any): Promise<AIMessage> {
    await delay(1200);

    const responses = [
      'Based on your profile, I recommend focusing on programs with strong research opportunities.',
      'Consider these programs that match your academic background and career goals.',
      'The programs I mentioned have excellent placement rates and industry connections.',
      'Would you like me to help you compare the specific requirements for these programs?'
    ];

    const response: AIMessage = {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: responses[Math.floor(Math.random() * responses.length)],
      timestamp: new Date().toISOString(),
      program_references: mockPrograms.slice(0, 2).map(program => ({
        id: program.id,
        title: program.title,
        university: program.university.name,
        url: `/program/${program.university.country.toLowerCase().replace(' ', '-')}/${program.university.slug}/${program.slug}-${program.id}`
      }))
    };

    return response;
  }

  async submitLead(leadData: LeadFormData): Promise<void> {
    await delay(600);
    console.log('Lead submitted:', leadData);
  }

  async getCountries(): Promise<string[]> {
    await delay(200);
    return mockCountries;
  }

  async getDisciplines(): Promise<string[]> {
    await delay(200);
    return mockDisciplines;
  }

  async getUniversities(country?: string): Promise<{ name: string; slug: string }[]> {
    await delay(200);
    let universities = mockUniversities;

    if (country) {
      universities = universities.filter(uni => uni.country === country);
    }

    return universities.map(uni => ({
      name: uni.name,
      slug: uni.slug
    }));
  }

  setAuthToken(token: string) {
    this.authToken = token;
  }

  clearAuthToken() {
    this.authToken = null;
    this.currentUser = null;
  }
}

export const mockApiClient = new MockApiClient();