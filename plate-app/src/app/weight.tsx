import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { useProfileStore } from '@/features/profile/store';
import { goalProgress, latestWeighIn, useWeightStore, weightLost } from '@/features/weight/store';
import { dayKey, formatShortDate } from '@/lib/date';
import { formatWeight, kgToUnit, unitToKg } from '@/lib/format';
import { haptic } from '@/lib/haptics';
import { useTween } from '@/lib/useTween';
import { colors, fonts, GUTTER, MAX_WIDTH, radius, space } from '@/theme/tokens';
import { Button, IconButton, Stepper } from '@/ui/Buttons';
import { ProgressBar, Sparkline } from '@/ui/Charts';
import { Row, Screen, Spacer } from '@/ui/Layout';
import { Text } from '@/ui/Text';

/** Weight lost, the trend, and a quick weigh-in. */
export default function WeightScreen() {
  const { width: windowWidth } = useWindowDimensions();
  const width = Math.min(windowWidth, MAX_WIDTH) - GUTTER * 2;
  const weighIns = useWeightStore((s) => s.weighIns);
  const log = useWeightStore((s) => s.log);
  const { startWeightKg, goalWeightKg, unit } = useProfileStore();

  const latest = latestWeighIn(weighIns);
  const lost = weightLost(startWeightKg, weighIns);
  const progress = goalProgress(startWeightKg, goalWeightKg, weighIns);
  const shown = useTween(Math.abs(kgToUnit(lost, unit)), 900, 0);

  // The stepper edits in the display unit, in 0.1 steps.
  const [draft, setDraft] = useState(() => Math.round(kgToUnit(latest?.kg ?? startWeightKg, unit) * 10) / 10);
  const loggedToday = latest && dayKey(latest.at) === dayKey();

  return (
    <Screen>
      <Row justify="space-between">
        <IconButton icon="arrow-left" accessibilityLabel="Back" onPress={() => router.back()} />
      </Row>

      <Spacer size={space.xl} />
      <Text variant="title">Weight</Text>
      <Text variant="title" color={colors.inkSoft} style={{ fontFamily: fonts.display }}>
        {lost < 0 ? 'Gained' : 'Lost so far'}
      </Text>

      <Spacer size={space.md} />
      <Row align="flex-end" gap={space.sm}>
        <Text variant="hero">{shown.toFixed(1)}</Text>
        <View style={{ paddingBottom: 18 }}>
          <Text variant="heading" style={{ fontFamily: fonts.displaySemi }}>
            {unit.toUpperCase()}
          </Text>
          <Text variant="label">{Math.round(progress * 100)}% to goal</Text>
        </View>
      </Row>

      <Spacer size={space.md} />
      <ProgressBar progress={progress} color={colors.tomato} height={8} />
      <Spacer size={space.md} />
      <Row justify="space-between">
        <Stat label="Start" value={formatWeight(startWeightKg, unit)} />
        <Stat label="Now" value={latest ? formatWeight(latest.kg, unit) : '—'} />
        <Stat label="Goal" value={formatWeight(goalWeightKg, unit)} />
      </Row>

      {weighIns.length > 1 ? (
        <>
          <Spacer size={space.xl} />
          <View style={styles.chartCard}>
            <Text variant="label">Trend</Text>
            <Spacer size={space.sm} />
            <Sparkline values={weighIns.map((w) => kgToUnit(w.kg, unit))} width={width - space.lg * 2} height={110} />
            <Row justify="space-between" style={{ marginTop: 6 }}>
              <Text variant="caption">{formatShortDate(weighIns[0].at)}</Text>
              <Text variant="caption">{formatShortDate(weighIns[weighIns.length - 1].at)}</Text>
            </Row>
          </View>
        </>
      ) : null}

      <Spacer size={space.xl} />
      <View style={styles.logCard}>
        <Text variant="label" color={colors.onTomatoSoft}>
          {loggedToday ? 'Update today’s weigh-in' : 'Log today’s weigh-in'}
        </Text>
        <Spacer size={space.sm} />
        <Stepper
          tone="white"
          onDecrement={() => setDraft((d) => Math.round((d - 0.1) * 10) / 10)}
          onIncrement={() => setDraft((d) => Math.round((d + 0.1) * 10) / 10)}>
          <Text style={styles.draft}>
            {draft.toFixed(1)}
            <Text style={styles.draftUnit}> {unit}</Text>
          </Text>
        </Stepper>
        <Spacer size={space.md} />
        <Button
          label="Save weight"
          tone="white"
          iconRight="check"
          onPress={() => {
            log(unitToKg(draft, unit));
            haptic.success();
          }}
        />
      </View>

      {weighIns.length ? (
        <>
          <Spacer size={space.xl} />
          <Text variant="label">History</Text>
          {[...weighIns].reverse().slice(0, 8).map((w) => (
            <Row key={w.id} justify="space-between" style={styles.historyRow}>
              <Text variant="body">{formatShortDate(w.at)}</Text>
              <Text variant="caption">{w.source === 'health' ? 'from health app' : ''}</Text>
              <Text variant="bodyStrong">
                {formatWeight(w.kg, unit)} {unit}
              </Text>
            </Row>
          ))}
        </>
      ) : null}
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View>
      <Text variant="label">{label}</Text>
      <Text style={styles.stat}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  stat: {
    fontFamily: fonts.displayMedium,
    fontSize: 22,
    color: colors.ink,
  },
  chartCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: space.lg,
  },
  logCard: {
    backgroundColor: colors.tomato,
    borderRadius: radius.xl,
    padding: space.lg,
  },
  draft: {
    fontFamily: fonts.displayLight,
    fontSize: 44,
    letterSpacing: -1.5,
    color: colors.onTomato,
  },
  draftUnit: {
    fontFamily: fonts.textSemi,
    fontSize: 14,
    color: colors.onTomatoSoft,
  },
  historyRow: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
});
