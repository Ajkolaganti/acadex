import {
  formatCurrency,
  formatDate,
  formatDuration,
  createSlug,
  createProgramUrl,
  debounce,
  throttle,
  getInitials,
  truncateText,
  isValidEmail,
  capitalizeFirst,
  pluralize,
  getRelativeTime
} from '../utils';

describe('utils', () => {
  describe('formatCurrency', () => {
    it('formats USD currency correctly', () => {
      expect(formatCurrency(50000)).toBe('$50,000');
      expect(formatCurrency(1000.99)).toBe('$1,001');
    });

    it('handles different currencies', () => {
      expect(formatCurrency(50000, 'EUR')).toBe('€50,000');
      expect(formatCurrency(50000, 'GBP')).toBe('£50,000');
    });

    it('handles zero and negative values', () => {
      expect(formatCurrency(0)).toBe('$0');
      expect(formatCurrency(-1000)).toBe('-$1,000');
    });
  });

  describe('formatDate', () => {
    it('formats date strings correctly', () => {
      const date = '2024-12-25';
      const result = formatDate(date);
      expect(result).toBe('December 25, 2024');
    });

    it('formats Date objects correctly', () => {
      const date = new Date('2024-12-25');
      const result = formatDate(date);
      expect(result).toBe('December 25, 2024');
    });
  });

  describe('formatDuration', () => {
    it('formats months to years correctly', () => {
      expect(formatDuration(12)).toBe('1 year');
      expect(formatDuration(24)).toBe('2 years');
      expect(formatDuration(36)).toBe('3 years');
    });

    it('formats months only when less than a year', () => {
      expect(formatDuration(6)).toBe('6 months');
      expect(formatDuration(1)).toBe('1 months');
    });

    it('formats mixed years and months', () => {
      expect(formatDuration(18)).toBe('1 year 6 months');
      expect(formatDuration(30)).toBe('2 years 6 months');
    });
  });

  describe('createSlug', () => {
    it('creates URL-friendly slugs', () => {
      expect(createSlug('Computer Science')).toBe('computer-science');
      expect(createSlug('Master of Business Administration')).toBe('master-of-business-administration');
    });

    it('handles special characters', () => {
      expect(createSlug('AI & Machine Learning!')).toBe('ai-machine-learning');
      expect(createSlug('Ph.D. in Computer Science')).toBe('phd-in-computer-science');
    });

    it('handles multiple spaces and hyphens', () => {
      expect(createSlug('Multiple   Spaces')).toBe('multiple-spaces');
      expect(createSlug('Already-Hyphenated')).toBe('already-hyphenated');
    });
  });

  describe('createProgramUrl', () => {
    it('creates correct program URLs', () => {
      const program = {
        university: {
          country: 'United States',
          slug: 'harvard-university'
        },
        slug: 'ms-computer-science',
        id: '123'
      };

      const url = createProgramUrl(program);
      expect(url).toBe('/program/united-states/harvard-university/ms-computer-science-123');
    });

    it('handles countries with special characters', () => {
      const program = {
        university: {
          country: 'United Kingdom',
          slug: 'oxford-university'
        },
        slug: 'mba-program',
        id: '456'
      };

      const url = createProgramUrl(program);
      expect(url).toBe('/program/united-kingdom/oxford-university/mba-program-456');
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    it('delays function execution', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 1000);

      debouncedFn('test');
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1000);
      expect(mockFn).toHaveBeenCalledWith('test');
    });

    it('cancels previous calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 1000);

      debouncedFn('first');
      debouncedFn('second');

      jest.advanceTimersByTime(1000);
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('second');
    });
  });

  describe('throttle', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    it('limits function calls', () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 1000);

      throttledFn('first');
      throttledFn('second');
      throttledFn('third');

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('first');

      jest.advanceTimersByTime(1000);
      throttledFn('fourth');

      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenCalledWith('fourth');
    });
  });

  describe('getInitials', () => {
    it('returns correct initials', () => {
      expect(getInitials('John', 'Doe')).toBe('JD');
      expect(getInitials('jane', 'smith')).toBe('JS');
    });

    it('handles single character names', () => {
      expect(getInitials('A', 'B')).toBe('AB');
    });
  });

  describe('truncateText', () => {
    it('truncates long text', () => {
      const longText = 'This is a very long text that should be truncated';
      expect(truncateText(longText, 20)).toBe('This is a very long...');
    });

    it('returns original text if shorter than limit', () => {
      const shortText = 'Short text';
      expect(truncateText(shortText, 20)).toBe('Short text');
    });

    it('truncates at word boundaries', () => {
      const text = 'This is some text';
      expect(truncateText(text, 10)).toBe('This is...');
    });
  });

  describe('isValidEmail', () => {
    it('validates correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('user+tag@example.org')).toBe(true);
    });

    it('rejects invalid email addresses', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test..test@example.com')).toBe(false);
    });
  });

  describe('capitalizeFirst', () => {
    it('capitalizes first letter', () => {
      expect(capitalizeFirst('hello')).toBe('Hello');
      expect(capitalizeFirst('WORLD')).toBe('World');
      expect(capitalizeFirst('tEST')).toBe('Test');
    });

    it('handles empty and single character strings', () => {
      expect(capitalizeFirst('')).toBe('');
      expect(capitalizeFirst('a')).toBe('A');
    });
  });

  describe('pluralize', () => {
    it('returns singular for count of 1', () => {
      expect(pluralize(1, 'item')).toBe('item');
      expect(pluralize(1, 'program')).toBe('program');
    });

    it('returns plural for other counts', () => {
      expect(pluralize(0, 'item')).toBe('items');
      expect(pluralize(2, 'item')).toBe('items');
      expect(pluralize(10, 'program')).toBe('programs');
    });

    it('uses custom plural form when provided', () => {
      expect(pluralize(2, 'child', 'children')).toBe('children');
      expect(pluralize(1, 'child', 'children')).toBe('child');
    });
  });

  describe('getRelativeTime', () => {
    beforeEach(() => {
      // Mock current time to January 1, 2024
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-01T12:00:00Z'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('returns "just now" for very recent times', () => {
      const recent = new Date('2024-01-01T11:59:30Z');
      expect(getRelativeTime(recent)).toBe('just now');
    });

    it('returns minutes ago for recent times', () => {
      const fiveMinutesAgo = new Date('2024-01-01T11:55:00Z');
      expect(getRelativeTime(fiveMinutesAgo)).toBe('5 minutes ago');
    });

    it('returns hours ago for older times', () => {
      const twoHoursAgo = new Date('2024-01-01T10:00:00Z');
      expect(getRelativeTime(twoHoursAgo)).toBe('2 hours ago');
    });

    it('returns days ago for much older times', () => {
      const threeDaysAgo = new Date('2023-12-29T12:00:00Z');
      expect(getRelativeTime(threeDaysAgo)).toBe('3 days ago');
    });

    it('returns months ago for very old times', () => {
      const twoMonthsAgo = new Date('2023-11-01T12:00:00Z');
      expect(getRelativeTime(twoMonthsAgo)).toBe('2 months ago');
    });
  });
});