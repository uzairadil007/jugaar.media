import { useEffect } from 'react';
import { AppState } from 'react-native';

import { healthProvider } from '@/services/health';

import { syncHealth, useStepsStore } from './store';

const REFRESH_MS = 60_000;

/**
 * Keeps steps fresh: syncs on launch, whenever the app comes back to the
 * foreground, once a minute while it's open, and on live HealthKit updates.
 * Mounted once in the root layout.
 */
export function useHealthSync(): void {
  const connected = useStepsStore((s) => s.connected);

  useEffect(() => {
    if (!connected) return;
    void syncHealth();

    let timer: ReturnType<typeof setInterval> | null = setInterval(() => void syncHealth(), REFRESH_MS);
    const appState = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        void syncHealth();
        if (!timer) timer = setInterval(() => void syncHealth(), REFRESH_MS);
      } else if (timer) {
        clearInterval(timer);
        timer = null;
      }
    });

    let unsubscribe: (() => void) | undefined;
    try {
      unsubscribe = healthProvider.subscribeToSteps?.(() => void syncHealth());
    } catch {
      // Live updates are a bonus; polling above still keeps things fresh.
    }

    return () => {
      if (timer) clearInterval(timer);
      appState.remove();
      unsubscribe?.();
    };
  }, [connected]);
}
