import { apiClient } from './api';
import { mockApiClient } from './mockApi';
import { isFeatureEnabled } from './featureFlags';

export const getApiClient = () => {
  return isFeatureEnabled('USE_MOCK_API') ? mockApiClient : apiClient;
};

export const api = getApiClient();