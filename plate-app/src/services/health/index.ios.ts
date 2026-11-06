import Constants, { ExecutionEnvironment } from 'expo-constants';

import { demoHealth } from './demo';
import type { HealthProvider } from './types';

/**
 * iOS → Apple Health. HealthKit's native module only exists in a development
 * or production build, so Expo Go falls back to the demo source.
 */
function pick(): HealthProvider {
  if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) return demoHealth;
  try {
    // Loaded lazily: importing HealthKit where its native module is missing throws.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return (require('./apple') as typeof import('./apple')).appleHealth;
  } catch {
    return demoHealth;
  }
}

export const healthProvider = pick();
export type { DailySteps, HealthProvider, HealthProviderId, WeightReading } from './types';
