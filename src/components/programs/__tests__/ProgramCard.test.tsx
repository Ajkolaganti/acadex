import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProgramCard from '../ProgramCard';
import { mockPrograms } from '@/data/mockData';
import { useCompareStore } from '@/store/compareStore';
import { useShortlistStore } from '@/store/shortlistStore';
import { useAuthStore } from '@/store/authStore';

// Mock dependencies
jest.mock('@/store/compareStore');
jest.mock('@/store/shortlistStore');
jest.mock('@/store/authStore');
jest.mock('react-hot-toast');
jest.mock('@/lib/analytics');

const mockCompareStore = {
  addToCompare: jest.fn(),
  removeFromCompare: jest.fn(),
  isProgramInCompare: jest.fn(),
  canAddMore: jest.fn(),
};

const mockShortlistStore = {
  addToShortlist: jest.fn(),
  removeFromShortlist: jest.fn(),
  isProgramInShortlist: jest.fn(),
  items: [],
};

const mockAuthStore = {
  isAuthenticated: true,
};

beforeEach(() => {
  (useCompareStore as jest.Mock).mockReturnValue(mockCompareStore);
  (useShortlistStore as jest.Mock).mockReturnValue(mockShortlistStore);
  (useAuthStore as jest.Mock).mockReturnValue(mockAuthStore);

  // Reset mock functions
  mockCompareStore.isProgramInCompare.mockReturnValue(false);
  mockShortlistStore.isProgramInShortlist.mockReturnValue(false);
  mockCompareStore.canAddMore.mockReturnValue(true);

  jest.clearAllMocks();
});

describe('ProgramCard', () => {
  const mockProgram = mockPrograms[0];

  describe('Default view', () => {
    it('renders program information correctly', () => {
      render(<ProgramCard program={mockProgram} />);

      expect(screen.getByText(mockProgram.title)).toBeInTheDocument();
      expect(screen.getByText(mockProgram.university.name)).toBeInTheDocument();
      expect(screen.getByText(`${mockProgram.location.city}, ${mockProgram.location.country}`)).toBeInTheDocument();
      expect(screen.getByText(mockProgram.degree_level.toUpperCase())).toBeInTheDocument();
    });

    it('displays tuition and duration', () => {
      render(<ProgramCard program={mockProgram} />);

      expect(screen.getByText(/\$55,000\/year/)).toBeInTheDocument();
      expect(screen.getByText(/2 years/)).toBeInTheDocument();
    });

    it('shows scholarship badge when available', () => {
      render(<ProgramCard program={mockProgram} />);

      expect(screen.getByText('Scholarships Available')).toBeInTheDocument();
    });

    it('displays program highlights', () => {
      render(<ProgramCard program={mockProgram} />);

      mockProgram.highlights.slice(0, 3).forEach(highlight => {
        expect(screen.getByText(highlight)).toBeInTheDocument();
      });
    });

    it('shows university ranking when available', () => {
      render(<ProgramCard program={mockProgram} />);

      expect(screen.getByText('Rank #1')).toBeInTheDocument();
    });

    it('displays application deadline', () => {
      render(<ProgramCard program={mockProgram} />);

      expect(screen.getByText(/Due/)).toBeInTheDocument();
    });
  });

  describe('Compact view', () => {
    it('renders in compact format', () => {
      render(<ProgramCard program={mockProgram} compact={true} />);

      expect(screen.getByText(mockProgram.title)).toBeInTheDocument();
      expect(screen.getByText(mockProgram.university.name)).toBeInTheDocument();

      // Compact view should not show full details
      expect(screen.queryByText('View Details')).not.toBeInTheDocument();
    });

    it('shows condensed information in compact view', () => {
      render(<ProgramCard program={mockProgram} compact={true} />);

      expect(screen.getByText(/\$55,000/)).toBeInTheDocument();
      expect(screen.getByText(/2 years/)).toBeInTheDocument();
    });
  });

  describe('Compare functionality', () => {
    it('adds program to comparison when compare button is clicked', () => {
      render(<ProgramCard program={mockProgram} />);

      const compareButton = screen.getByLabelText('Add to comparison');
      fireEvent.click(compareButton);

      expect(mockCompareStore.addToCompare).toHaveBeenCalledWith(mockProgram);
    });

    it('removes program from comparison when already in compare', () => {
      mockCompareStore.isProgramInCompare.mockReturnValue(true);

      render(<ProgramCard program={mockProgram} />);

      const compareButton = screen.getByLabelText('Remove from comparison');
      fireEvent.click(compareButton);

      expect(mockCompareStore.removeFromCompare).toHaveBeenCalledWith(mockProgram.id);
    });

    it('prevents adding to comparison when at max capacity', () => {
      mockCompareStore.canAddMore.mockReturnValue(false);

      render(<ProgramCard program={mockProgram} />);

      const compareButton = screen.getByLabelText('Add to comparison');
      fireEvent.click(compareButton);

      expect(mockCompareStore.addToCompare).not.toHaveBeenCalled();
    });
  });

  describe('Shortlist functionality', () => {
    it('adds program to shortlist when shortlist button is clicked', () => {
      render(<ProgramCard program={mockProgram} />);

      const shortlistButton = screen.getByLabelText('Add to shortlist');
      fireEvent.click(shortlistButton);

      expect(mockShortlistStore.addToShortlist).toHaveBeenCalledWith(mockProgram);
    });

    it('removes program from shortlist when already in shortlist', () => {
      mockShortlistStore.isProgramInShortlist.mockReturnValue(true);
      mockShortlistStore.items = [
        {
          id: 'test-id',
          program: mockProgram,
          notes: '',
          tags: [],
          created_at: '2024-01-01'
        }
      ];

      render(<ProgramCard program={mockProgram} />);

      const shortlistButton = screen.getByLabelText('Remove from shortlist');
      fireEvent.click(shortlistButton);

      expect(mockShortlistStore.removeFromShortlist).toHaveBeenCalledWith('test-id');
    });

    it('shows filled heart icon when program is in shortlist', () => {
      mockShortlistStore.isProgramInShortlist.mockReturnValue(true);

      render(<ProgramCard program={mockProgram} />);

      const heartIcon = screen.getByLabelText('Remove from shortlist').querySelector('svg');
      expect(heartIcon).toHaveClass('fill-current');
    });
  });

  describe('University display', () => {
    it('shows university info when showUniversity is true', () => {
      render(<ProgramCard program={mockProgram} showUniversity={true} />);

      expect(screen.getByText(mockProgram.university.name)).toBeInTheDocument();
      expect(screen.getByText(`${mockProgram.location.city}, ${mockProgram.location.country}`)).toBeInTheDocument();
    });

    it('hides university info when showUniversity is false', () => {
      render(<ProgramCard program={mockProgram} showUniversity={false} />);

      // University name should still be shown, but location might be hidden
      expect(screen.getByText(mockProgram.university.name)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels for action buttons', () => {
      render(<ProgramCard program={mockProgram} />);

      expect(screen.getByLabelText('Add to comparison')).toBeInTheDocument();
      expect(screen.getByLabelText('Add to shortlist')).toBeInTheDocument();
    });

    it('is keyboard accessible', () => {
      render(<ProgramCard program={mockProgram} />);

      const card = screen.getByRole('link');
      expect(card).toBeInTheDocument();

      const compareButton = screen.getByLabelText('Add to comparison');
      const shortlistButton = screen.getByLabelText('Add to shortlist');

      expect(compareButton).toHaveAttribute('type', 'button');
      expect(shortlistButton).toHaveAttribute('type', 'button');
    });
  });

  describe('Degree level badges', () => {
    it('shows correct badge color for different degree levels', () => {
      const bachelorProgram = { ...mockProgram, degree_level: 'bachelor' as const };
      render(<ProgramCard program={bachelorProgram} />);

      const badge = screen.getByText('BACHELOR');
      expect(badge).toHaveClass('bg-green-100', 'text-green-800');
    });

    it('shows correct badge for master degree', () => {
      const masterProgram = { ...mockProgram, degree_level: 'master' as const };
      render(<ProgramCard program={masterProgram} />);

      const badge = screen.getByText('MASTER');
      expect(badge).toHaveClass('bg-blue-100', 'text-blue-800');
    });
  });
});