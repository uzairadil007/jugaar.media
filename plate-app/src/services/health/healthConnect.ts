import {
  aggregateGroupByPeriod,
  aggregateRecord,
  getSdkStatus,
  initialize,
  openHealthConnectSettings,
  readRecords,
  requestPermission,
  SdkAvailabilityStatus,
} from 'react-native-health-connect';

import { addDays, dayKey, startOfDay } from '@/lib/date';

import type { DailySteps, HealthProvider } from './types';

let initialized = false;
async function ready(): Promise<boolean> {
  if (!initialized) initialized = await initialize();
  return initialized;
}

/**
 * Android Health Connect. Google Fit, Samsung Health, Fitbit and most
 * step-counting apps write their steps into Health Connect, so reading from
 * here covers all of them. Needs a dev/production build (not Expo Go).
 */
export const healthConnect: HealthProvider = {
  id: 'health-connect',
  label: 'Health Connect',
  isDemo: false,

  async isAvailable() {
    const status = await getSdkStatus();
    return status === SdkAvailabilityStatus.SDK_AVAILABLE;
  },

  async requestAccess() {
    if (!(await ready())) return false;
    const granted = await requestPermission([
      { accessType: 'read', recordType: 'Steps' },
      { accessType: 'read', recordType: 'Weight' },
    ]);
    return granted.some((p) => 'recordType' in p && p.recordType === 'Steps');
  },

  async getStepsToday() {
    if (!(await ready())) return 0;
    const result = await aggregateRecord({
      recordType: 'Steps',
      timeRangeFilter: {
        operator: 'between',
        startTime: startOfDay().toISOString(),
        endTime: new Date().toISOString(),
      },
    });
    return Math.round(result.COUNT_TOTAL ?? 0);
  },

  async getDailySteps(days) {
    const from = startOfDay(addDays(new Date(), -(days - 1)));
    const byDay = new Map<string, number>();
    if (await ready()) {
      const groups = await aggregateGroupByPeriod({
        recordType: 'Steps',
        timeRangeFilter: {
          operator: 'between',
          startTime: from.toISOString(),
          endTime: new Date().toISOString(),
        },
        timeRangeSlicer: { period: 'DAYS', length: 1 },
      });
      for (const g of groups) byDay.set(dayKey(new Date(g.startTime)), Math.round(g.result.COUNT_TOTAL ?? 0));
    }
    const out: DailySteps[] = [];
    for (let i = 0; i < days; i++) {
      const day = dayKey(addDays(from, i));
      out.push({ day, steps: byDay.get(day) ?? 0 });
    }
    return out;
  },

  async getLatestWeight() {
    if (!(await ready())) return null;
    const { records } = await readRecords('Weight', {
      timeRangeFilter: { operator: 'after', startTime: addDays(new Date(), -365).toISOString() },
      ascendingOrder: false,
      pageSize: 1,
    });
    const latest = records[0];
    if (!latest) return null;
    return { kg: latest.weight.inKilograms, at: new Date(latest.time).toISOString() };
  },

  openSettings() {
    openHealthConnectSettings();
  },
};
