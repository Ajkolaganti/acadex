import { FeatureFlags } from '@/types';

export const getFeatureFlags = (): FeatureFlags => ({
  USE_MOCK_API: process.env.NEXT_PUBLIC_FEATURE_FLAG_USE_MOCK_API === 'true',
  ANALYTICS_ENABLED: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true',
});

export const isFeatureEnabled = (flag: keyof FeatureFlags): boolean => {
  const flags = getFeatureFlags();
  return flags[flag];
};