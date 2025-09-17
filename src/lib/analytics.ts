import { AnalyticsEvent } from '@/types';
import { isFeatureEnabled } from './featureFlags';

interface AnalyticsAdapter {
  track(event: AnalyticsEvent): void;
  identify(userId: string, traits?: Record<string, any>): void;
  page(name: string, properties?: Record<string, any>): void;
}

class ConsoleAnalyticsAdapter implements AnalyticsAdapter {
  track(event: AnalyticsEvent): void {
    console.log('Analytics Track:', event);
  }

  identify(userId: string, traits?: Record<string, any>): void {
    console.log('Analytics Identify:', { userId, traits });
  }

  page(name: string, properties?: Record<string, any>): void {
    console.log('Analytics Page:', { name, properties });
  }
}

class GoogleAnalyticsAdapter implements AnalyticsAdapter {
  track(event: AnalyticsEvent): void {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.event_name, {
        ...event.properties,
        custom_map: event.properties
      });
    }
  }

  identify(userId: string, traits?: Record<string, any>): void {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
        user_id: userId,
        custom_map: traits
      });
    }
  }

  page(name: string, properties?: Record<string, any>): void {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
        page_title: name,
        page_location: window.location.href,
        ...properties
      });
    }
  }
}

class MixpanelAdapter implements AnalyticsAdapter {
  track(event: AnalyticsEvent): void {
    if (typeof window !== 'undefined' && (window as any).mixpanel) {
      (window as any).mixpanel.track(event.event_name, event.properties);
    }
  }

  identify(userId: string, traits?: Record<string, any>): void {
    if (typeof window !== 'undefined' && (window as any).mixpanel) {
      (window as any).mixpanel.identify(userId);
      if (traits) {
        (window as any).mixpanel.people.set(traits);
      }
    }
  }

  page(name: string, properties?: Record<string, any>): void {
    if (typeof window !== 'undefined' && (window as any).mixpanel) {
      (window as any).mixpanel.track('Page Viewed', {
        page_name: name,
        ...properties
      });
    }
  }
}

class Analytics {
  private adapters: AnalyticsAdapter[] = [];
  private enabled: boolean;

  constructor() {
    this.enabled = isFeatureEnabled('ANALYTICS_ENABLED');

    if (this.enabled) {
      // Add console adapter for development
      if (process.env.NODE_ENV === 'development') {
        this.adapters.push(new ConsoleAnalyticsAdapter());
      }

      // Add Google Analytics if configured
      if (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
        this.adapters.push(new GoogleAnalyticsAdapter());
      }

      // Add Mixpanel if configured
      if (process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
        this.adapters.push(new MixpanelAdapter());
      }
    }
  }

  track(eventName: string, properties: Record<string, any> = {}): void {
    if (!this.enabled) return;

    const event: AnalyticsEvent = {
      event_name: eventName,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined
      }
    };

    this.adapters.forEach(adapter => {
      try {
        adapter.track(event);
      } catch (error) {
        console.error('Analytics track error:', error);
      }
    });
  }

  identify(userId: string, traits: Record<string, any> = {}): void {
    if (!this.enabled) return;

    this.adapters.forEach(adapter => {
      try {
        adapter.identify(userId, traits);
      } catch (error) {
        console.error('Analytics identify error:', error);
      }
    });
  }

  page(name: string, properties: Record<string, any> = {}): void {
    if (!this.enabled) return;

    this.adapters.forEach(adapter => {
      try {
        adapter.page(name, properties);
      } catch (error) {
        console.error('Analytics page error:', error);
      }
    });
  }

  // Predefined event methods
  searchSubmitted(query: string, filters: Record<string, any>, resultCount: number): void {
    this.track('search_submitted', {
      query,
      filters,
      result_count: resultCount
    });
  }

  filterApplied(filterType: string, filterValue: any): void {
    this.track('filter_applied', {
      filter_type: filterType,
      filter_value: filterValue
    });
  }

  programViewed(programId: string, programTitle: string, universityName: string): void {
    this.track('program_viewed', {
      program_id: programId,
      program_title: programTitle,
      university_name: universityName
    });
  }

  shortlistAdded(programId: string, programTitle: string): void {
    this.track('shortlist_added', {
      program_id: programId,
      program_title: programTitle
    });
  }

  shortlistRemoved(programId: string, programTitle: string): void {
    this.track('shortlist_removed', {
      program_id: programId,
      program_title: programTitle
    });
  }

  compareOpened(programIds: string[]): void {
    this.track('compare_opened', {
      program_ids: programIds,
      program_count: programIds.length
    });
  }

  compareAdded(programId: string, programTitle: string): void {
    this.track('compare_added', {
      program_id: programId,
      program_title: programTitle
    });
  }

  leadSubmitted(formData: Record<string, any>): void {
    this.track('lead_submitted', {
      interested_programs_count: formData.interested_programs?.length || 0,
      budget_range: formData.budget_range,
      target_intake: formData.target_intake,
      country: formData.country
    });
  }

  aiMessageSent(message: string, hasContext: boolean): void {
    this.track('ai_message_sent', {
      message_length: message.length,
      has_context: hasContext
    });
  }

  userRegistered(method: string): void {
    this.track('user_registered', {
      registration_method: method
    });
  }

  userLoggedIn(method: string): void {
    this.track('user_logged_in', {
      login_method: method
    });
  }
}

export const analytics = new Analytics();
export default analytics;