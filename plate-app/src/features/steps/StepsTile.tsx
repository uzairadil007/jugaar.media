import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { useProfileStore } from '@/features/profile/store';
import { formatNumber } from '@/lib/format';
import { useTween } from '@/lib/useTween';
import { healthProvider } from '@/services/health';
import { colors, fonts, radius } from '@/theme/tokens';
import { ProgressBar } from '@/ui/Charts';
import { Icon } from '@/ui/Icon';
import { Text } from '@/ui/Text';

import { currentSteps, useStepsStore } from './store';

/** Home screen: steps taken today, synced from the phone's health app. */
export function StepsTile() {
  const connected = useStepsStore((s) => s.connected);
  const steps = useStepsStore(currentSteps);
  const goal = useProfileStore((s) => s.stepGoal);
  const shown = useTween(steps, 900, 0);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Steps today"
      onPress={() => router.push('/steps')}
      style={({ pressed }) => [styles.tile, pressed && { opacity: 0.85 }]}>
      <View style={styles.head}>
        <View style={styles.icon}>
          <Icon name="steps" size={18} />
        </View>
        <Text variant="label">Steps</Text>
      </View>

      {connected ? (
        <>
          <Text style={styles.number}>{formatNumber(shown)}</Text>
          <View style={styles.foot}>
            <ProgressBar progress={steps / goal} color={colors.tomato} />
            <Text variant="caption">of {formatNumber(goal)}</Text>
          </View>
        </>
      ) : (
        <>
          <Text style={[styles.number, { color: colors.inkFaint }]}>—</Text>
          <View style={styles.foot}>
            <Text variant="caption" numberOfLines={2}>
              Tap to sync {healthProvider.isDemo ? 'steps' : healthProvider.label}
            </Text>
          </View>
        </>
      )}
    </Pressable>
  );
}

export const tileStyles = StyleSheet.create({
  tile: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 18,
    minHeight: 168,
    justifyContent: 'space-between',
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: {
    fontFamily: fonts.displayLight,
    fontSize: 38,
    lineHeight: 44,
    letterSpacing: -1.4,
    color: colors.ink,
    marginTop: 10,
  },
  foot: {
    gap: 8,
    marginTop: 6,
  },
});

const styles = tileStyles;
