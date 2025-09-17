import { Program, University, User, ShortlistItem, AIMessage } from '@/types';

export const mockUniversities: University[] = [
  {
    id: '1',
    name: 'Harvard University',
    slug: 'harvard-university',
    country: 'United States',
    city: 'Cambridge',
    logo: 'https://picsum.photos/100/100?random=1',
    images: [
      'https://images.unsplash.com/photo-1562774053-701939374585?w=800',
      'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800'
    ],
    ranking: {
      world: 1,
      national: 1,
      source: 'QS World University Rankings'
    },
    website: 'https://harvard.edu',
    established: 1636,
    description: 'Harvard University is a private Ivy League research university in Cambridge, Massachusetts.'
  },
  {
    id: '2',
    name: 'University of Oxford',
    slug: 'university-of-oxford',
    country: 'United Kingdom',
    city: 'Oxford',
    logo: 'https://picsum.photos/100/100?random=2',
    images: [
      'https://images.unsplash.com/photo-1520637836862-4d197d17c13a?w=800',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800'
    ],
    ranking: {
      world: 2,
      national: 1,
      source: 'QS World University Rankings'
    },
    website: 'https://ox.ac.uk',
    established: 1096,
    description: 'The University of Oxford is a collegiate research university in Oxford, England.'
  },
  {
    id: '3',
    name: 'Stanford University',
    slug: 'stanford-university',
    country: 'United States',
    city: 'Stanford',
    logo: 'https://picsum.photos/100/100?random=3',
    images: [
      'https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=800',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'
    ],
    ranking: {
      world: 3,
      national: 2,
      source: 'QS World University Rankings'
    },
    website: 'https://stanford.edu',
    established: 1885,
    description: 'Stanford University is a private research university in Stanford, California.'
  }
];

export const mockPrograms: Program[] = [
  {
    id: '1',
    title: 'Master of Science in Computer Science',
    slug: 'ms-computer-science',
    university: mockUniversities[0],
    degree_level: 'master',
    discipline: 'Computer Science',
    duration_months: 24,
    tuition_usd: 55000,
    currency: 'USD',
    location: {
      city: 'Cambridge',
      country: 'United States',
      campus: 'Main Campus'
    },
    intakes: ['Fall', 'Spring'],
    entry_requirements: {
      academic: ['Bachelor\'s degree in Computer Science or related field', 'GPA 3.5 or higher'],
      language: {
        ielts_min: 7.0,
        toefl_min: 100
      },
      other: ['GRE required', '3 letters of recommendation', 'Statement of purpose']
    },
    application_deadline: '2024-12-15',
    scholarships_available: true,
    acceptance_rate: 8,
    description: 'A comprehensive graduate program in computer science covering algorithms, systems, AI, and more.',
    highlights: [
      'World-class faculty',
      'State-of-the-art research facilities',
      'Strong industry connections',
      'Excellent career outcomes'
    ],
    similar_programs: ['2', '3'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    title: 'DPhil in Computer Science',
    slug: 'dphil-computer-science',
    university: mockUniversities[1],
    degree_level: 'phd',
    discipline: 'Computer Science',
    duration_months: 48,
    tuition_usd: 45000,
    currency: 'GBP',
    location: {
      city: 'Oxford',
      country: 'United Kingdom',
      campus: 'Main Campus'
    },
    intakes: ['Michaelmas', 'Hilary', 'Trinity'],
    entry_requirements: {
      academic: ['Master\'s degree in Computer Science or related field', 'First-class honours or equivalent'],
      language: {
        ielts_min: 7.5,
        toefl_min: 110
      },
      other: ['Research proposal', '3 academic references', 'Interview required']
    },
    application_deadline: '2024-11-30',
    scholarships_available: true,
    acceptance_rate: 15,
    description: 'A research-intensive doctoral program with world-leading supervision and facilities.',
    highlights: [
      'Cutting-edge research opportunities',
      'Tutorial system',
      'Access to Bodleian Libraries',
      'Strong alumni network'
    ],
    similar_programs: ['1', '3'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    title: 'MS in Artificial Intelligence',
    slug: 'ms-artificial-intelligence',
    university: mockUniversities[2],
    degree_level: 'master',
    discipline: 'Computer Science',
    duration_months: 18,
    tuition_usd: 58000,
    currency: 'USD',
    location: {
      city: 'Stanford',
      country: 'United States',
      campus: 'Main Campus'
    },
    intakes: ['Fall'],
    entry_requirements: {
      academic: ['Bachelor\'s degree in CS, Math, or related field', 'Strong mathematical background'],
      language: {
        ielts_min: 7.0,
        toefl_min: 100
      },
      other: ['GRE recommended', 'Programming experience', 'Statement of purpose']
    },
    application_deadline: '2024-12-01',
    scholarships_available: true,
    acceptance_rate: 12,
    description: 'Specialized master\'s program focusing on artificial intelligence and machine learning.',
    highlights: [
      'AI research labs',
      'Industry partnerships',
      'Silicon Valley location',
      'Career placement support'
    ],
    similar_programs: ['1', '2'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

export const mockUser: User = {
  id: 'user-1',
  email: 'john.doe@example.com',
  first_name: 'John',
  last_name: 'Doe',
  profile: {
    interests: ['Computer Science', 'Artificial Intelligence'],
    budget_usd: 60000,
    preferred_countries: ['United States', 'United Kingdom'],
    tests_taken: {
      ielts_score: 7.5,
      gre_score: 325
    },
    academic_background: {
      highest_degree: 'Bachelor',
      field_of_study: 'Computer Science',
      gpa: 3.8
    },
    target_intake: 'Fall 2024'
  },
  created_at: '2024-01-01T00:00:00Z'
};

export const mockShortlist: ShortlistItem[] = [
  {
    id: 'shortlist-1',
    program: mockPrograms[0],
    notes: 'Great program, excellent faculty',
    tags: ['top-choice', 'cs'],
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'shortlist-2',
    program: mockPrograms[2],
    notes: 'Strong AI focus',
    tags: ['ai', 'machine-learning'],
    created_at: '2024-01-02T00:00:00Z'
  }
];

export const mockAIMessages: AIMessage[] = [
  {
    id: 'msg-1',
    role: 'user',
    content: 'What are the best computer science programs for AI research?',
    timestamp: '2024-01-01T12:00:00Z'
  },
  {
    id: 'msg-2',
    role: 'assistant',
    content: 'Based on your profile and interests, I recommend these top programs for AI research. Harvard and Stanford both have excellent AI research facilities and strong industry connections.',
    timestamp: '2024-01-01T12:00:30Z',
    program_references: [
      {
        id: '1',
        title: 'Master of Science in Computer Science',
        university: 'Harvard University',
        url: '/program/united-states/harvard-university/ms-computer-science-1'
      },
      {
        id: '3',
        title: 'MS in Artificial Intelligence',
        university: 'Stanford University',
        url: '/program/united-states/stanford-university/ms-artificial-intelligence-3'
      }
    ]
  }
];

export const mockCountries = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Netherlands',
  'Switzerland',
  'Sweden',
  'Singapore',
  'Japan',
  'South Korea'
];

export const mockDisciplines = [
  'Computer Science',
  'Engineering',
  'Business Administration',
  'Medicine',
  'Law',
  'Psychology',
  'Economics',
  'Physics',
  'Chemistry',
  'Biology',
  'Mathematics',
  'Art & Design',
  'Literature',
  'History',
  'Philosophy'
];

export const mockDegreeLevels = [
  'bachelor',
  'master',
  'phd',
  'diploma',
  'certificate'
];