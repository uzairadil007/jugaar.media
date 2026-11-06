import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { dayKey } from '@/lib/date';
import { makeId } from '@/lib/format';
import { deviceStorage, STORAGE_PREFIX } from '@/lib/storage';

export type WeighIn = {
  id: string;
  kg: number;
  at: string;
  source: 'manual' | 'health';
};

type WeightState = {
  weighIns: WeighIn[];
  /** Logs a weight. A second entry on the same day replaces the first. */
  log: (kg: number, at?: Date, source?: WeighIn['source']) => void;
  remove: (id: string) => void;
  replaceAll: (weighIns: WeighIn[]) => void;
};

export const useWeightStore = create<WeightState>()(
  persist(
    (set) => ({
      weighIns: [],
      log: (kg, at = new Date(), source = 'manual') =>
        set((s) => {
          const day = dayKey(at);
          const rest = s.weighIns.filter((w) => dayKey(w.at) !== day);
          const next = [...rest, { id: makeId(), kg, at: at.toISOString(), source }];
          return { weighIns: next.sort((a, b) => a.at.localeCompare(b.at)) };
        }),
      remove: (id) => set((s) => ({ weighIns: s.weighIns.filter((w) => w.id !== id) })),
      replaceAll: (weighIns) => set({ weighIns }),
    }),
    { name: `${STORAGE_PREFIX}weight`, storage: deviceStorage, version: 1 },
  ),
);

/* ───────────── Selectors ───────────── */

export function latestWeighIn(weighIns: WeighIn[]): WeighIn | undefined {
  return weighIns.length ? weighIns[weighIns.length - 1] : undefined;
}

/** Positive when weight has gone down since the start. */
export function weightLost(startKg: number, weighIns: WeighIn[]): number {
  const latest = latestWeighIn(weighIns);
  if (!latest) return 0;
  return Math.round((startKg - latest.kg) * 10) / 10;
}

/** 0–1 of the way from start weight to goal weight. */
export function goalProgress(startKg: number, goalKg: number, weighIns: WeighIn[]): number {
  const latest = latestWeighIn(weighIns);
  if (!latest || startKg === goalKg) return 0;
  return Math.max(0, Math.min(1, (startKg - latest.kg) / (startKg - goalKg)));
}
