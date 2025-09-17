import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import SearchBar from '../SearchBar';
import { useSearchStore } from '@/store/searchStore';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/store/searchStore', () => ({
  useSearchStore: jest.fn(),
}));

jest.mock('@/lib/analytics', () => ({
  default: {
    searchSubmitted: jest.fn(),
  },
}));

const mockPush = jest.fn();
const mockSetQuery = jest.fn();
const mockSetFilters = jest.fn();
const mockSearch = jest.fn();

beforeEach(() => {
  (useRouter as jest.Mock).mockReturnValue({
    push: mockPush,
  });

  (useSearchStore as jest.Mock).mockReturnValue({
    setQuery: mockSetQuery,
    setFilters: mockSetFilters,
    search: mockSearch,
  });

  jest.clearAllMocks();
});

describe('SearchBar', () => {
  it('renders search input with placeholder', () => {
    render(<SearchBar />);

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Search programs, universities, or destinations...');
  });

  it('renders search button', () => {
    render(<SearchBar />);

    const button = screen.getByRole('button', { name: /search/i });
    expect(button).toBeInTheDocument();
  });

  it('displays search suggestions when showSuggestions is true', () => {
    render(<SearchBar showSuggestions={true} />);

    expect(screen.getByText('Popular searches:')).toBeInTheDocument();
    expect(screen.getByText('Computer Science Masters')).toBeInTheDocument();
    expect(screen.getByText('MBA Programs')).toBeInTheDocument();
    expect(screen.getByText('Study in USA')).toBeInTheDocument();
    expect(screen.getByText('Engineering PhD')).toBeInTheDocument();
  });

  it('does not display suggestions when showSuggestions is false', () => {
    render(<SearchBar showSuggestions={false} />);

    expect(screen.queryByText('Popular searches:')).not.toBeInTheDocument();
  });

  it('updates input value when typing', () => {
    render(<SearchBar />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'computer science' } });

    expect(input).toHaveValue('computer science');
  });

  it('submits search on form submission', async () => {
    render(<SearchBar />);

    const input = screen.getByRole('textbox');
    const form = input.closest('form');

    fireEvent.change(input, { target: { value: 'computer science' } });
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(mockSetQuery).toHaveBeenCalledWith('computer science');
      expect(mockPush).toHaveBeenCalledWith('/search?q=computer%20science');
    });
  });

  it('handles suggestion clicks', async () => {
    render(<SearchBar showSuggestions={true} />);

    const suggestionButton = screen.getByText('Computer Science Masters');
    fireEvent.click(suggestionButton);

    await waitFor(() => {
      expect(mockSetQuery).toHaveBeenCalledWith('computer science');
      expect(mockSetFilters).toHaveBeenCalledWith({ degree_level: ['master'] });
      expect(mockPush).toHaveBeenCalledWith('/search?q=computer%20science&degree_level=master');
    });
  });

  it('does not submit empty search', async () => {
    render(<SearchBar />);

    const form = screen.getByRole('textbox').closest('form');
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(mockSetQuery).not.toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  it('shows loading state when searching', async () => {
    render(<SearchBar />);

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.click(button);

    // Should show loading spinner briefly
    expect(button).toBeDisabled();
  });

  it('uses custom placeholder when provided', () => {
    const customPlaceholder = 'Find your dream program...';
    render(<SearchBar placeholder={customPlaceholder} />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder', customPlaceholder);
  });

  it('applies large size styling when size is large', () => {
    render(<SearchBar size="large" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('h-14', 'text-lg');
  });

  it('has proper accessibility attributes', () => {
    render(<SearchBar />);

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /search/i });

    expect(input).toHaveAttribute('aria-label', 'Search for programs and universities');
    expect(button).toHaveAttribute('aria-label', 'Search');
  });
});