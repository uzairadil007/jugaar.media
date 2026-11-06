import type { Macros } from '@/features/meals/types';

export type Food = Macros & {
  id: string;
  name: string;
  emoji: string;
  /** Calories for one `portion`. */
  kcal: number;
  portion: string;
  /** Extra words people might search for. */
  aliases?: string[];
};

/**
 * A small built-in food list so the app works offline and before the backend
 * exists. Values are typical per-portion estimates. The backend can replace
 * this with a real nutrition database behind the same `searchFoods` call.
 */
export const FOODS: readonly Food[] = [
  // breakfast
  { id: 'oats', name: 'Oatmeal with milk', emoji: '🥣', kcal: 300, portion: '1 bowl', protein: 11, carbs: 48, fat: 7, aliases: ['porridge', 'oats'] },
  { id: 'eggs-boiled', name: 'Boiled eggs', emoji: '🥚', kcal: 155, portion: '2 eggs', protein: 13, carbs: 1, fat: 11, aliases: ['egg'] },
  { id: 'omelette', name: 'Masala omelette', emoji: '🍳', kcal: 230, portion: '2 eggs', protein: 14, carbs: 4, fat: 17, aliases: ['egg', 'anda'] },
  { id: 'paratha', name: 'Plain paratha', emoji: '🫓', kcal: 300, portion: '1 piece', protein: 6, carbs: 38, fat: 14 },
  { id: 'aloo-paratha', name: 'Aloo paratha', emoji: '🫓', kcal: 330, portion: '1 piece', protein: 7, carbs: 45, fat: 14, aliases: ['potato'] },
  { id: 'chai', name: 'Doodh patti chai', emoji: '☕', kcal: 120, portion: '1 cup', protein: 4, carbs: 15, fat: 5, aliases: ['tea'] },
  { id: 'greek-yogurt', name: 'Greek yogurt', emoji: '🥛', kcal: 145, portion: '170 g', protein: 17, carbs: 6, fat: 4, aliases: ['dahi', 'curd'] },
  { id: 'avocado-toast', name: 'Avocado toast', emoji: '🥑', kcal: 290, portion: '1 slice', protein: 7, carbs: 30, fat: 17 },
  { id: 'pb-toast', name: 'Peanut butter toast', emoji: '🍞', kcal: 270, portion: '1 slice', protein: 10, carbs: 26, fat: 15 },
  { id: 'banana', name: 'Banana', emoji: '🍌', kcal: 105, portion: '1 medium', protein: 1, carbs: 27, fat: 0, aliases: ['kela'] },
  { id: 'latte', name: 'Latte', emoji: '☕', kcal: 190, portion: '350 ml', protein: 10, carbs: 18, fat: 7, aliases: ['coffee'] },
  { id: 'black-coffee', name: 'Black coffee', emoji: '☕', kcal: 5, portion: '1 cup', protein: 0, carbs: 0, fat: 0, aliases: ['americano'] },
  { id: 'protein-shake', name: 'Protein shake', emoji: '🥤', kcal: 160, portion: '1 scoop + water', protein: 25, carbs: 6, fat: 3, aliases: ['whey'] },
  { id: 'smoothie', name: 'Berry smoothie', emoji: '🫐', kcal: 220, portion: '1 glass', protein: 6, carbs: 42, fat: 3 },
  { id: 'pancakes', name: 'Pancakes', emoji: '🥞', kcal: 350, portion: '3 small', protein: 8, carbs: 55, fat: 10 },

  // lunch & dinner
  { id: 'chicken-breast', name: 'Grilled chicken breast', emoji: '🍗', kcal: 280, portion: '150 g', protein: 52, carbs: 0, fat: 6 },
  { id: 'rice', name: 'White rice', emoji: '🍚', kcal: 205, portion: '1 cup', protein: 4, carbs: 45, fat: 0, aliases: ['chawal'] },
  { id: 'roti', name: 'Roti', emoji: '🫓', kcal: 120, portion: '1 piece', protein: 4, carbs: 22, fat: 2, aliases: ['chapati', 'phulka'] },
  { id: 'daal', name: 'Daal', emoji: '🍲', kcal: 230, portion: '1 bowl', protein: 13, carbs: 32, fat: 6, aliases: ['lentils', 'dal'] },
  { id: 'chicken-karahi', name: 'Chicken karahi', emoji: '🍛', kcal: 420, portion: '1 plate', protein: 34, carbs: 8, fat: 28 },
  { id: 'biryani', name: 'Chicken biryani', emoji: '🍛', kcal: 560, portion: '1 plate', protein: 26, carbs: 70, fat: 19 },
  { id: 'nihari', name: 'Beef nihari', emoji: '🍲', kcal: 480, portion: '1 bowl', protein: 32, carbs: 10, fat: 34 },
  { id: 'haleem', name: 'Haleem', emoji: '🍲', kcal: 390, portion: '1 bowl', protein: 24, carbs: 34, fat: 17 },
  { id: 'chana', name: 'Chana masala', emoji: '🥘', kcal: 270, portion: '1 bowl', protein: 11, carbs: 36, fat: 9, aliases: ['chickpeas', 'cholay'] },
  { id: 'salad', name: 'Garden salad', emoji: '🥗', kcal: 120, portion: '1 bowl', protein: 3, carbs: 10, fat: 8 },
  { id: 'caesar', name: 'Chicken caesar salad', emoji: '🥗', kcal: 440, portion: '1 bowl', protein: 30, carbs: 18, fat: 28 },
  { id: 'salmon', name: 'Baked salmon', emoji: '🐟', kcal: 370, portion: '170 g', protein: 39, carbs: 0, fat: 23, aliases: ['fish'] },
  { id: 'pasta', name: 'Pasta bolognese', emoji: '🍝', kcal: 520, portion: '1 plate', protein: 25, carbs: 66, fat: 16, aliases: ['spaghetti'] },
  { id: 'burger', name: 'Beef burger', emoji: '🍔', kcal: 540, portion: '1 burger', protein: 28, carbs: 40, fat: 30 },
  { id: 'pizza', name: 'Pizza', emoji: '🍕', kcal: 285, portion: '1 slice', protein: 12, carbs: 36, fat: 10 },
  { id: 'shawarma', name: 'Chicken shawarma', emoji: '🌯', kcal: 480, portion: '1 wrap', protein: 30, carbs: 42, fat: 20, aliases: ['wrap'] },
  { id: 'sandwich', name: 'Club sandwich', emoji: '🥪', kcal: 420, portion: '1 sandwich', protein: 24, carbs: 38, fat: 19 },
  { id: 'sushi', name: 'Salmon sushi', emoji: '🍣', kcal: 300, portion: '6 pieces', protein: 14, carbs: 42, fat: 7 },
  { id: 'steak', name: 'Sirloin steak', emoji: '🥩', kcal: 410, portion: '200 g', protein: 52, carbs: 0, fat: 22, aliases: ['beef'] },
  { id: 'veg-stirfry', name: 'Veg stir-fry', emoji: '🥦', kcal: 210, portion: '1 bowl', protein: 7, carbs: 24, fat: 10, aliases: ['vegetables'] },
  { id: 'soup', name: 'Chicken soup', emoji: '🍜', kcal: 180, portion: '1 bowl', protein: 14, carbs: 16, fat: 6 },

  // snacks & drinks
  { id: 'apple', name: 'Apple', emoji: '🍎', kcal: 95, portion: '1 medium', protein: 0, carbs: 25, fat: 0, aliases: ['saib'] },
  { id: 'almonds', name: 'Almonds', emoji: '🌰', kcal: 165, portion: '28 g', protein: 6, carbs: 6, fat: 14, aliases: ['nuts', 'badam'] },
  { id: 'samosa', name: 'Samosa', emoji: '🥟', kcal: 260, portion: '1 piece', protein: 4, carbs: 26, fat: 16 },
  { id: 'pakora', name: 'Pakora', emoji: '🧆', kcal: 230, portion: '5 pieces', protein: 5, carbs: 20, fat: 15 },
  { id: 'dates', name: 'Dates', emoji: '🌴', kcal: 140, portion: '3 dates', protein: 1, carbs: 37, fat: 0, aliases: ['khajoor'] },
  { id: 'lassi', name: 'Sweet lassi', emoji: '🥛', kcal: 260, portion: '1 glass', protein: 8, carbs: 40, fat: 7 },
  { id: 'orange-juice', name: 'Orange juice', emoji: '🍊', kcal: 110, portion: '1 glass', protein: 2, carbs: 26, fat: 0 },
  { id: 'cola', name: 'Cola', emoji: '🥤', kcal: 140, portion: '330 ml', protein: 0, carbs: 39, fat: 0, aliases: ['soda', 'coke'] },
  { id: 'dark-chocolate', name: 'Dark chocolate', emoji: '🍫', kcal: 170, portion: '30 g', protein: 2, carbs: 13, fat: 12, aliases: ['chocolate'] },
  { id: 'cookie', name: 'Chocolate chip cookie', emoji: '🍪', kcal: 160, portion: '1 large', protein: 2, carbs: 22, fat: 8, aliases: ['biscuit'] },
  { id: 'protein-bar', name: 'Protein bar', emoji: '🍫', kcal: 210, portion: '1 bar', protein: 20, carbs: 22, fat: 7 },
  { id: 'popcorn', name: 'Popcorn', emoji: '🍿', kcal: 110, portion: '3 cups', protein: 3, carbs: 22, fat: 1 },
  { id: 'fries', name: 'French fries', emoji: '🍟', kcal: 365, portion: 'medium', protein: 4, carbs: 48, fat: 17, aliases: ['chips'] },
  { id: 'ice-cream', name: 'Ice cream', emoji: '🍨', kcal: 210, portion: '2 scoops', protein: 4, carbs: 24, fat: 11, aliases: ['kulfi'] },
  { id: 'mango', name: 'Mango', emoji: '🥭', kcal: 200, portion: '1 whole', protein: 3, carbs: 50, fat: 1, aliases: ['aam'] },
];

export function foodById(id: string): Food | undefined {
  return FOODS.find((f) => f.id === id);
}
