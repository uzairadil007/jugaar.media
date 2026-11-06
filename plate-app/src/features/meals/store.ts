import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { dayKey } from '@/lib/date';
import { makeId } from '@/lib/format';
import { deviceStorage, STORAGE_PREFIX } from '@/lib/storage';

import type { FoodEntry, MealSlot, NewFoodEntry } from './types';

/**
 * Everything the user has eaten, stored on the device.
 *
 * Backend hook-up: keep this shape and replace the bodies of `add` / `remove`
 * with API calls (optimistically updating `entries` first), then hydrate
 * `entries` from the server on launch.
 */
type MealsState = {
  entries: FoodEntry[];
  add: (entry: NewFoodEntry) => FoodEntry;
  addMany: (entries: NewFoodEntry[]) => void;
  remove: (id: string) => void;
  move: (id: string, slot: MealSlot) => void;
  replaceAll: (entries: FoodEntry[]) => void;
};

export const useMealsStore = create<MealsState>()(
  persist(
    (set) => ({
      entries: [],
      add: (entry) => {
        const saved: FoodEntry = { ...entry, id: makeId() };
        set((s) => ({ entries: [...s.entries, saved] }));
        return saved;
      },
      addMany: (entries) =>
        set((s) => ({ entries: [...s.entries, ...entries.map((e) => ({ ...e, id: makeId() }))] })),
      remove: (id) => set((s) => ({ entries: s.entries.filter((e) => e.id !== id) })),
      move: (id, slot) =>
        set((s) => ({ entries: s.entries.map((e) => (e.id === id ? { ...e, slot } : e)) })),
      replaceAll: (entries) => set({ entries }),
    }),
    { name: `${STORAGE_PREFIX}meals`, storage: deviceStorage, version: 1 },
  ),
);

/* ───────────── Selectors ───────────── */

export function entriesForDay(entries: FoodEntry[], day: string): FoodEntry[] {
  return entries
    .filter((e) => dayKey(e.eatenAt) === day)
    .sort((a, b) => a.eatenAt.localeCompare(b.eatenAt));
}

export function entriesForSlot(entries: FoodEntry[], day: string, slot: MealSlot): FoodEntry[] {
  return entriesForDay(entries, day).filter((e) => e.slot === slot);
}

export type Totals = { kcal: number; protein: number; carbs: number; fat: number };

export function totalsOf(entries: FoodEntry[]): Totals {
  return entries.reduce<Totals>(
    (t, e) => ({
      kcal: t.kcal + e.kcal,
      protein: t.protein + e.protein,
      carbs: t.carbs + e.carbs,
      fat: t.fat + e.fat,
    }),
    { kcal: 0, protein: 0, carbs: 0, fat: 0 },
  );
}

/** Days in a row (ending today or yesterday) with at least one thing logged. */
export function loggingStreak(entries: FoodEntry[]): number {
  const days = new Set(entries.map((e) => dayKey(e.eatenAt)));
  const cursor = new Date();
  if (!days.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (days.has(dayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

/** Most recently logged distinct foods, newest first. */
export function recentFoods(entries: FoodEntry[], limit = 6): FoodEntry[] {
  const seen = new Set<string>();
  const out: FoodEntry[] = [];
  for (const e of [...entries].sort((a, b) => b.eatenAt.localeCompare(a.eatenAt))) {
    const key = e.foodId ?? e.name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(e);
    if (out.length >= limit) break;
  }
  return out;
}
