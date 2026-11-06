import { FOODS, type Food } from './catalog';

export type RecognizedItem = {
  food: Food;
  /** 0–1, how sure the model is. */
  confidence: number;
  /** Portion multiplier the model estimated (1 = one catalogue portion). */
  servings: number;
};

export type Recognition = {
  items: RecognizedItem[];
  /** True while this is the on-device demo, so the UI can say so. */
  isDemo: boolean;
};

/**
 * Photo → foods. This is the Cal AI-style "snap your meal" step.
 *
 * Backend hook-up: upload `imageUri` to your vision endpoint and map its
 * response into `Recognition`. Until then this returns a believable demo
 * result so the flow can be designed and tested end to end.
 */
export async function recognizeMeal(imageUri: string): Promise<Recognition> {
  await new Promise((r) => setTimeout(r, 1800));

  // Pick a stable "meal" from the image uri so the same photo gives the same answer.
  let hash = 0;
  for (let i = 0; i < imageUri.length; i++) hash = (hash * 31 + imageUri.charCodeAt(i)) | 0;
  const meals = DEMO_MEALS[Math.abs(hash) % DEMO_MEALS.length];

  return {
    isDemo: true,
    items: meals
      .map(([id, servings, confidence]) => {
        const food = FOODS.find((f) => f.id === id);
        return food ? { food, servings, confidence } : null;
      })
      .filter((x): x is RecognizedItem => x !== null),
  };
}

const DEMO_MEALS: [id: string, servings: number, confidence: number][][] = [
  [
    ['chicken-breast', 1, 0.93],
    ['rice', 1, 0.88],
    ['salad', 1, 0.71],
  ],
  [
    ['chicken-karahi', 1, 0.9],
    ['roti', 2, 0.86],
  ],
  [
    ['avocado-toast', 1, 0.91],
    ['eggs-boiled', 1, 0.82],
    ['latte', 1, 0.64],
  ],
  [
    ['biryani', 1, 0.94],
    ['salad', 0.5, 0.6],
  ],
  [
    ['salmon', 1, 0.89],
    ['veg-stirfry', 1, 0.77],
  ],
];
