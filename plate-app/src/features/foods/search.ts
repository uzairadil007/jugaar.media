import { FOODS, type Food } from './catalog';

/**
 * Food search.
 *
 * Backend hook-up: make this call your nutrition API. Screens only depend on
 * this function signature, so nothing else needs to change.
 */
export async function searchFoods(query: string, limit = 30): Promise<Food[]> {
  return searchLocalFoods(query, limit);
}

/** Synchronous local search, used while typing. */
export function searchLocalFoods(query: string, limit = 30): Food[] {
  const q = query.trim().toLowerCase();
  if (!q) return FOODS.slice(0, limit);

  const scored: { food: Food; score: number }[] = [];
  for (const food of FOODS) {
    const name = food.name.toLowerCase();
    const words = [name, ...(food.aliases ?? [])];
    let score = 0;
    if (name.startsWith(q)) score = 3;
    else if (words.some((w) => w.split(/\s+/).some((part) => part.startsWith(q)))) score = 2;
    else if (words.some((w) => w.includes(q))) score = 1;
    if (score > 0) scored.push({ food, score });
  }
  return scored
    .sort((a, b) => b.score - a.score || a.food.name.localeCompare(b.food.name))
    .slice(0, limit)
    .map((s) => s.food);
}
