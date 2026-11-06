import type { MealSlot } from './types';

export type SlotInfo = {
  id: MealSlot;
  label: string;
  /** Shown on the card, like "PROTEIN" on the reference. */
  window: string;
  /** Share of the daily calorie goal this plate holds when full. */
  share: number;
  emoji: string;
};

export const SLOTS: readonly SlotInfo[] = [
  { id: 'breakfast', label: 'Breakfast', window: '5 – 11 am', share: 0.25, emoji: '🍳' },
  { id: 'lunch', label: 'Lunch', window: '11 am – 4 pm', share: 0.35, emoji: '🥗' },
  { id: 'dinner', label: 'Dinner', window: '6 – 11 pm', share: 0.3, emoji: '🍲' },
  { id: 'snacks', label: 'Snacks', window: 'Any time', share: 0.1, emoji: '🍎' },
] as const;

export const SLOT_IDS = SLOTS.map((s) => s.id);

export function slotInfo(id: MealSlot): SlotInfo {
  return SLOTS.find((s) => s.id === id) ?? SLOTS[0];
}

export function isMealSlot(value: unknown): value is MealSlot {
  return typeof value === 'string' && (SLOT_IDS as string[]).includes(value);
}

/** How many calories fill this plate, given the daily goal. */
export function slotTarget(id: MealSlot, dailyGoal: number): number {
  return Math.round(dailyGoal * slotInfo(id).share);
}

/** Picks the plate a food most likely belongs on from the time it was eaten. */
export function slotForTime(d: Date): MealSlot {
  const h = d.getHours() + d.getMinutes() / 60;
  if (h >= 5 && h < 11) return 'breakfast';
  if (h >= 11 && h < 16) return 'lunch';
  if (h >= 18 && h < 23) return 'dinner';
  return 'snacks';
}
