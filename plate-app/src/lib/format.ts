export type WeightUnit = 'kg' | 'lb';

const KG_PER_LB = 0.45359237;

/** 6482 → "6,482" */
export function formatNumber(n: number): string {
  return Math.round(n).toLocaleString('en-US');
}

export function kgToUnit(kg: number, unit: WeightUnit): number {
  return unit === 'kg' ? kg : kg / KG_PER_LB;
}

export function unitToKg(value: number, unit: WeightUnit): number {
  return unit === 'kg' ? value : value * KG_PER_LB;
}

/** 78.64 kg → "78.6" (or the pounds equivalent). */
export function formatWeight(kg: number, unit: WeightUnit): string {
  return kgToUnit(kg, unit).toFixed(1);
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/** Short random id; good enough for local records until the backend assigns ids. */
export function makeId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
