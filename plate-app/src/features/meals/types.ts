export type MealSlot = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

export type Macros = {
  /** grams */
  protein: number;
  /** grams */
  carbs: number;
  /** grams */
  fat: number;
};

/** One thing the user ate. Totals already include the portion size. */
export type FoodEntry = Macros & {
  id: string;
  name: string;
  emoji: string;
  kcal: number;
  /** "1 bowl", "2 × 1 slice"… */
  portion: string;
  slot: MealSlot;
  /** When it was eaten (ISO string, local time is derived from it). */
  eatenAt: string;
  /** How it got logged, so the backend can learn from corrections later. */
  source: 'search' | 'quick' | 'scan';
  /** Local id of the food in the catalogue, if it came from search. */
  foodId?: string;
  photoUri?: string;
};

export type NewFoodEntry = Omit<FoodEntry, 'id'>;
