/**
 * The app talks to phone health data only through this interface.
 * One implementation per platform:
 *  - iOS      → Apple Health (HealthKit)            ./apple.ts
 *  - Android  → Health Connect (where Google Fit,
 *               Samsung Health etc. sync steps to)  ./healthConnect.ts
 *  - web / Expo Go → demo numbers                   ./demo.ts
 */
export type HealthProviderId = 'apple-health' | 'health-connect' | 'demo';

export type DailySteps = {
  /** Local day key, "2026-11-06". */
  day: string;
  steps: number;
};

export type WeightReading = {
  kg: number;
  at: string;
};

export interface HealthProvider {
  id: HealthProviderId;
  /** Shown in the UI: "Apple Health", "Health Connect"… */
  label: string;
  /** True for the demo source, so the UI can say the numbers aren't real. */
  isDemo: boolean;
  isAvailable(): Promise<boolean>;
  /** Shows the system permission sheet. Resolves true if the app can read steps. */
  requestAccess(): Promise<boolean>;
  getStepsToday(): Promise<number>;
  /** The last `days` days, oldest first, today last. */
  getDailySteps(days: number): Promise<DailySteps[]>;
  getLatestWeight(): Promise<WeightReading | null>;
  /** Live updates where the platform supports them. Returns an unsubscribe function. */
  subscribeToSteps?(onChange: () => void): () => void;
  /** Opens the platform's own health settings, if it has one. */
  openSettings?(): void;
}
