import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { seedDemoData } from '@/features/app';
import { Plate } from '@/features/meals/components/Plate';
import { useProfileStore } from '@/features/profile/store';
import { connectHealth } from '@/features/steps/store';
import { useWeightStore } from '@/features/weight/store';
import { formatNumber, unitToKg, type WeightUnit } from '@/lib/format';
import { colors, fonts, GUTTER, radius, space } from '@/theme/tokens';
import { Button, Chip, Stepper } from '@/ui/Buttons';
import { Field, Row, Screen, Spacer } from '@/ui/Layout';
import { Text } from '@/ui/Text';

const SAMPLE = [
  { id: 'a', kcal: 320, emoji: '🥣' },
  { id: 'b', kcal: 180, emoji: '🍌' },
  { id: 'c', kcal: 120, emoji: '☕' },
];

/** First launch: four answers and you're in. */
export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const update = useProfileStore((s) => s.update);
  const logWeight = useWeightStore((s) => s.log);

  const [name, setName] = useState('');
  const [unit, setUnit] = useState<WeightUnit>('kg');
  const [weight, setWeight] = useState(80);
  const [goalWeight, setGoalWeight] = useState(72);
  const [calories, setCalories] = useState(2000);

  const finish = (demo: boolean) => {
    const startKg = unitToKg(weight, unit);
    update({
      name: name.trim(),
      unit,
      startWeightKg: startKg,
      goalWeightKg: unitToKg(goalWeight, unit),
      calorieGoal: calories,
      onboarded: true,
      startedAt: new Date().toISOString(),
    });
    if (demo) seedDemoData();
    else logWeight(startKg);
    // Ask for steps straight away; if they say no, the Steps tile offers it again.
    void connectHealth();
    router.replace('/');
  };

  const switchUnit = (next: WeightUnit) => {
    if (next === unit) return;
    const factor = next === 'lb' ? 2.20462 : 1 / 2.20462;
    setWeight((w) => Math.round(w * factor * 10) / 10);
    setGoalWeight((w) => Math.round(w * factor * 10) / 10);
    setUnit(next);
  };

  return (
    <Screen padded={false} edges={{ top: false, bottom: true }}>
      <View style={[styles.hero, { paddingTop: insets.top + space.xl }]}>
        <Text variant="label" color={colors.onTomatoSoft}>
          plate.
        </Text>
        <Text style={styles.headline}>{'Fill your\nplate.'}</Text>
        <Text variant="body" color={colors.onTomatoSoft} style={{ maxWidth: 220 }}>
          Log what you eat and when. Steps sync on their own. Watch the weight come off.
        </Text>
        <View style={styles.heroPlate}>
          <Plate items={SAMPLE} target={800} size={170} />
        </View>
      </View>

      <View style={styles.form}>
        <Field label="What should we call you" value={name} onChangeText={setName} placeholder="Your name" autoCapitalize="words" />

        <Row justify="space-between">
          <Text variant="label">Units</Text>
          <Row gap={6}>
            <Chip label="kg" selected={unit === 'kg'} onPress={() => switchUnit('kg')} />
            <Chip label="lb" selected={unit === 'lb'} onPress={() => switchUnit('lb')} />
          </Row>
        </Row>

        <Question label={`Weight today (${unit})`}>
          <Stepper
            onDecrement={() => setWeight((w) => Math.round((w - 0.5) * 10) / 10)}
            onIncrement={() => setWeight((w) => Math.round((w + 0.5) * 10) / 10)}>
            <Text style={styles.value}>{weight.toFixed(1)}</Text>
          </Stepper>
        </Question>

        <Question label={`Goal weight (${unit})`}>
          <Stepper
            onDecrement={() => setGoalWeight((w) => Math.round((w - 0.5) * 10) / 10)}
            onIncrement={() => setGoalWeight((w) => Math.round((w + 0.5) * 10) / 10)}>
            <Text style={styles.value}>{goalWeight.toFixed(1)}</Text>
          </Stepper>
        </Question>

        <Question label="Calories a day">
          <Stepper
            onDecrement={() => setCalories((c) => Math.max(1000, c - 50))}
            onIncrement={() => setCalories((c) => Math.min(5000, c + 50))}>
            <Text style={styles.value}>{formatNumber(calories)}</Text>
          </Stepper>
          <Text variant="caption" align="center" style={{ marginTop: space.xs }}>
            Split across four plates. You can change it any time.
          </Text>
        </Question>

        <Spacer size={space.xs} />
        <Button label="Start" iconRight="arrow-right" onPress={() => finish(false)} />
        <Button label="Look around with a demo week" tone="outline" onPress={() => finish(true)} />
      </View>
    </Screen>
  );
}

function Question({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.question}>
      <Text variant="label" style={{ marginBottom: space.xs }}>
        {label}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.tomato,
    paddingHorizontal: GUTTER,
    paddingBottom: space.xxl,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
    overflow: 'hidden',
  },
  headline: {
    fontFamily: fonts.displayBold,
    fontSize: 52,
    lineHeight: 54,
    letterSpacing: -1.5,
    color: colors.onTomato,
    marginTop: space.sm,
    marginBottom: space.sm,
  },
  heroPlate: {
    position: 'absolute',
    right: -34,
    bottom: -24,
  },
  form: {
    padding: GUTTER,
    gap: space.sm,
  },
  question: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: space.md,
  },
  value: {
    fontFamily: fonts.displayMedium,
    fontSize: 26,
    color: colors.ink,
  },
});
