import {
  getMostRecentQuantitySample,
  isHealthDataAvailableAsync,
  queryStatisticsCollectionForQuantity,
  queryStatisticsForQuantity,
  requestAuthorization,
  subscribeToChanges,
} from '@kingstinct/react-native-healthkit';
import { Linking } from 'react-native';

import { addDays, dayKey, startOfDay } from '@/lib/date';

import type { DailySteps, HealthProvider } from './types';

const STEPS = 'HKQuantityTypeIdentifierStepCount';
const BODY_MASS = 'HKQuantityTypeIdentifierBodyMass';

/**
 * Apple Health (HealthKit). Only loaded on iOS dev/production builds —
 * HealthKit isn't available inside Expo Go.
 */
export const appleHealth: HealthProvider = {
  id: 'apple-health',
  label: 'Apple Health',
  isDemo: false,

  isAvailable: () => isHealthDataAvailableAsync(),

  async requestAccess() {
    // HealthKit never tells apps whether *read* access was granted (privacy by design),
    // so success here means the sheet was shown; reads simply come back empty if denied.
    return requestAuthorization({ toRead: [STEPS, BODY_MASS] });
  },

  async getStepsToday() {
    const result = await queryStatisticsForQuantity(STEPS, ['cumulativeSum'], {
      filter: { date: { startDate: startOfDay(), endDate: new Date() } },
      unit: 'count',
    });
    return Math.round(result.sumQuantity?.quantity ?? 0);
  },

  async getDailySteps(days) {
    const from = startOfDay(addDays(new Date(), -(days - 1)));
    const buckets = await queryStatisticsCollectionForQuantity(
      STEPS,
      ['cumulativeSum'],
      from,
      { day: 1 },
      { filter: { date: { startDate: from, endDate: new Date() } }, unit: 'count' },
    );
    const byDay = new Map<string, number>();
    for (const b of buckets) {
      if (b.startDate) byDay.set(dayKey(b.startDate), Math.round(b.sumQuantity?.quantity ?? 0));
    }
    const out: DailySteps[] = [];
    for (let i = 0; i < days; i++) {
      const day = dayKey(addDays(from, i));
      out.push({ day, steps: byDay.get(day) ?? 0 });
    }
    return out;
  },

  async getLatestWeight() {
    const sample = await getMostRecentQuantitySample(BODY_MASS, 'kg');
    if (!sample) return null;
    return { kg: sample.quantity, at: new Date(sample.endDate).toISOString() };
  },

  subscribeToSteps(onChange) {
    const subscription = subscribeToChanges(STEPS, () => onChange());
    return () => subscription.remove();
  },

  openSettings() {
    // Health permissions live under Settings → Health → Data Access & Devices.
    void Linking.openSettings();
  },
};
