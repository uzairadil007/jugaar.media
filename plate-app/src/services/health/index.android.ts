import Constants, { ExecutionEnvironment } from 'expo-constants';

import { demoHealth } from './demo';
import type { HealthProvider } from './types';

/**
 * Android → Health Connect. Its native module only exists in a development
 * or production build, so Expo Go falls back to the demo source.
 */
function pick(): HealthProvider {
  if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) return demoHealth;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return (require('./healthConnect') as typeof import('./healthConnect')).healthConnect;
  } catch {
    return demoHealth;
  }
}

export const healthProvider = pick();
export type { DailySteps, HealthProvider, HealthProviderId, WeightReading } from './types';
