import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { dayKey } from '@/lib/date';
import { deviceStorage, STORAGE_PREFIX } from '@/lib/storage';
import { healthProvider, type DailySteps } from '@/services/health';
import { latestWeighIn, useWeightStore } from '@/features/weight/store';

/**
 * Steps come from the phone's health app; this store only caches the last
 * sync so the home screen shows numbers instantly on launch.
 */
type StepsState = {
  /** The user turned syncing on. */
  connected: boolean;
  stepsToday: number;
  /** Day `stepsToday` belongs to, so yesterday's count is never shown as today's. */
  stepsDay: string;
  week: DailySteps[];
  lastSyncAt: string | null;
  syncing: boolean;
  error: string | null;
};

export const useStepsStore = create<StepsState>()(
  persist(
    (): StepsState => ({
      connected: false,
      stepsToday: 0,
      stepsDay: dayKey(),
      week: [],
      lastSyncAt: null,
      syncing: false,
      error: null,
    }),
    {
      name: `${STORAGE_PREFIX}steps`,
      storage: deviceStorage,
      version: 1,
      partialize: ({ syncing: _syncing, error: _error, ...rest }) => rest,
    },
  ),
);

/** Today's steps, or 0 if the cached number is from an earlier day. */
export function currentSteps(s: Pick<StepsState, 'stepsToday' | 'stepsDay'>): number {
  return s.stepsDay === dayKey() ? s.stepsToday : 0;
}

/** Pulls steps (and the latest weight, if any) from the health app. */
export async function syncHealth(): Promise<void> {
  const state = useStepsStore.getState();
  if (!state.connected || state.syncing) return;
  useStepsStore.setState({ syncing: true, error: null });
  try {
    const [today, week, weight] = await Promise.all([
      healthProvider.getStepsToday(),
      healthProvider.getDailySteps(7),
      healthProvider.getLatestWeight().catch(() => null),
    ]);
    useStepsStore.setState({
      stepsToday: today,
      stepsDay: dayKey(),
      week,
      lastSyncAt: new Date().toISOString(),
    });

    // A newer weigh-in from a smart scale / the health app counts towards "lost".
    if (weight) {
      const latest = latestWeighIn(useWeightStore.getState().weighIns);
      if (!latest || weight.at > latest.at) {
        useWeightStore.getState().log(weight.kg, new Date(weight.at), 'health');
      }
    }
  } catch (e) {
    useStepsStore.setState({ error: e instanceof Error ? e.message : 'Could not read steps' });
  } finally {
    useStepsStore.setState({ syncing: false });
  }
}

/** Asks for permission and starts syncing. Resolves false if the user said no. */
export async function connectHealth(): Promise<boolean> {
  try {
    if (!(await healthProvider.isAvailable())) {
      useStepsStore.setState({ error: `${healthProvider.label} isn't available on this phone` });
      return false;
    }
    const ok = await healthProvider.requestAccess();
    if (!ok) {
      useStepsStore.setState({ error: 'Permission to read steps was not given' });
      return false;
    }
    useStepsStore.setState({ connected: true, error: null });
    await syncHealth();
    return true;
  } catch (e) {
    useStepsStore.setState({ error: e instanceof Error ? e.message : 'Could not connect' });
    return false;
  }
}

export function disconnectHealth(): void {
  useStepsStore.setState({ connected: false, stepsToday: 0, week: [], lastSyncAt: null, error: null });
}
