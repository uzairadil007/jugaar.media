import { addDays, dayKey } from '@/lib/date';

import type { DailySteps, HealthProvider } from './types';

/** Same numbers every time for a given day, so the preview feels stable. */
function fullDaySteps(day: Date): number {
  const n = Number(dayKey(day).replaceAll('-', ''));
  const noise = Math.abs(Math.sin(n * 12.9898) * 43758.5453) % 1;
  return Math.round(5200 + noise * 7600);
}

/** Today's steps grow through the waking day. */
function stepsSoFarToday(): number {
  const now = new Date();
  const hours = now.getHours() + now.getMinutes() / 60;
  const progress = Math.max(0, Math.min(1, (hours - 7) / 15));
  return Math.round(fullDaySteps(now) * progress);
}

/**
 * Used on the web preview and in Expo Go, where Apple Health and
 * Health Connect can't be reached. The UI labels these numbers as demo data.
 */
export const demoHealth: HealthProvider = {
  id: 'demo',
  label: 'Demo data',
  isDemo: true,
  isAvailable: async () => true,
  requestAccess: async () => true,
  getStepsToday: async () => stepsSoFarToday(),
  getDailySteps: async (days) => {
    const out: DailySteps[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = addDays(new Date(), -i);
      out.push({ day: dayKey(d), steps: i === 0 ? stepsSoFarToday() : fullDaySteps(d) });
    }
    return out;
  },
  getLatestWeight: async () => null,
};
