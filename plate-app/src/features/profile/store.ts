import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { WeightUnit } from '@/lib/format';
import { deviceStorage, STORAGE_PREFIX } from '@/lib/storage';

export type Profile = {
  name: string;
  /** Calories per day that make all four plates full. */
  calorieGoal: number;
  stepGoal: number;
  /** Weight on day one; "lost" is measured from here. */
  startWeightKg: number;
  goalWeightKg: number;
  unit: WeightUnit;
  onboarded: boolean;
  startedAt: string;
};

type ProfileState = Profile & {
  update: (patch: Partial<Profile>) => void;
  reset: () => void;
};

const defaults: Profile = {
  name: '',
  calorieGoal: 2000,
  stepGoal: 10000,
  startWeightKg: 80,
  goalWeightKg: 72,
  unit: 'kg',
  onboarded: false,
  startedAt: new Date().toISOString(),
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      ...defaults,
      update: (patch) => set(patch),
      reset: () => set({ ...defaults, startedAt: new Date().toISOString() }),
    }),
    { name: `${STORAGE_PREFIX}profile`, storage: deviceStorage, version: 1 },
  ),
);
