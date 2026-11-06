// Web (and any platform without its own file): demo numbers only.
// iOS resolves ./index.ios.ts and Android resolves ./index.android.ts instead.
import { demoHealth } from './demo';

export const healthProvider = demoHealth;
export type { DailySteps, HealthProvider, HealthProviderId, WeightReading } from './types';
