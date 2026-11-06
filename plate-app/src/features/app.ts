import { useEffect, useState } from 'react';

import { FOODS } from '@/features/foods/catalog';
import { useMealsStore } from '@/features/meals/store';
import type { FoodEntry, MealSlot } from '@/features/meals/types';
import { useProfileStore } from '@/features/profile/store';
import { disconnectHealth, useStepsStore } from '@/features/steps/store';
import { useWeightStore, type WeighIn } from '@/features/weight/store';
import { addDays, startOfDay } from '@/lib/date';
import { makeId } from '@/lib/format';

const stores = [useProfileStore, useMealsStore, useWeightStore, useStepsStore];

/** True once every store has been read back from the device. */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(() => stores.every((s) => s.persist.hasHydrated()));

  useEffect(() => {
    if (hydrated) return;
    const check = () => {
      if (stores.every((s) => s.persist.hasHydrated())) setHydrated(true);
    };
    const unsubs = stores.map((s) => s.persist.onFinishHydration(check));
    check();
    return () => unsubs.forEach((u) => u());
  }, [hydrated]);

  return hydrated;
}

/** Wipes everything on the device and returns to onboarding. */
export function resetAllData(): void {
  useMealsStore.getState().replaceAll([]);
  useWeightStore.getState().replaceAll([]);
  disconnectHealth();
  useProfileStore.getState().reset();
}

/* ───────────── Demo week ───────────── */

const DEMO_DAYS: [slot: MealSlot, hour: number, minute: number, foodId: string, servings?: number][][] = [
  [
    ['breakfast', 8, 10, 'oats'],
    ['breakfast', 8, 15, 'chai'],
    ['lunch', 13, 20, 'chicken-karahi'],
    ['lunch', 13, 22, 'roti', 2],
    ['snacks', 17, 0, 'apple'],
    ['dinner', 20, 30, 'daal'],
    ['dinner', 20, 32, 'rice'],
  ],
  [
    ['breakfast', 7, 45, 'omelette'],
    ['breakfast', 7, 50, 'latte'],
    ['lunch', 12, 40, 'caesar'],
    ['snacks', 16, 30, 'almonds'],
    ['dinner', 19, 50, 'salmon'],
    ['dinner', 19, 52, 'veg-stirfry'],
  ],
  [
    ['breakfast', 9, 0, 'greek-yogurt'],
    ['breakfast', 9, 5, 'banana'],
    ['lunch', 14, 0, 'biryani'],
    ['dinner', 21, 0, 'chicken-breast'],
    ['dinner', 21, 2, 'salad'],
  ],
];

/**
 * Fills the app with a believable last week (meals, weigh-ins) so every screen
 * can be seen with data. Today gets breakfast and part of lunch only.
 */
export function seedDemoData(): void {
  const entries: FoodEntry[] = [];
  const today = startOfDay();
  const now = new Date();

  for (let back = 6; back >= 0; back--) {
    const day = addDays(today, -back);
    const plan = DEMO_DAYS[back % DEMO_DAYS.length];
    for (const [slot, h, m, foodId, servings = 1] of plan) {
      const at = new Date(day);
      at.setHours(h, m, 0, 0);
      if (back === 0 && (at > now || slot === 'dinner' || slot === 'snacks')) continue;
      const food = FOODS.find((f) => f.id === foodId);
      if (!food) continue;
      entries.push({
        id: makeId(),
        foodId: food.id,
        name: food.name,
        emoji: food.emoji,
        kcal: Math.round(food.kcal * servings),
        protein: Math.round(food.protein * servings),
        carbs: Math.round(food.carbs * servings),
        fat: Math.round(food.fat * servings),
        portion: servings === 1 ? food.portion : `${servings} × ${food.portion}`,
        slot,
        eatenAt: at.toISOString(),
        source: 'search',
      });
    }
  }

  const start = useProfileStore.getState().startWeightKg;
  const weighIns: WeighIn[] = [];
  for (let week = 5; week >= 0; week--) {
    const at = addDays(today, -week * 6);
    at.setHours(7, 30, 0, 0);
    const kg = start - (5 - week) * 0.7 - (week % 2 ? 0.2 : 0);
    weighIns.push({ id: makeId(), kg: Math.round(kg * 10) / 10, at: at.toISOString(), source: 'manual' });
  }

  useMealsStore.getState().replaceAll(entries);
  useWeightStore.getState().replaceAll(weighIns);
  useProfileStore.getState().update({ startedAt: addDays(today, -30).toISOString() });
}
