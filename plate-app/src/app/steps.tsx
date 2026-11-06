import { router } from 'expo-router';
import { ActivityIndicator, StyleSheet, useWindowDimensions, View } from 'react-native';

import { useProfileStore } from '@/features/profile/store';
import { connectHealth, currentSteps, disconnectHealth, syncHealth, useStepsStore } from '@/features/steps/store';
import { dayKey, fromDayKey, timeAgo, weekdayLetter } from '@/lib/date';
import { formatNumber } from '@/lib/format';
import { useTween } from '@/lib/useTween';
import { healthProvider } from '@/services/health';
import { colors, fonts, GUTTER, MAX_WIDTH, radius, space } from '@/theme/tokens';
import { Button, IconButton } from '@/ui/Buttons';
import { WeekBars } from '@/ui/Charts';
import { Icon } from '@/ui/Icon';
import { Row, Screen, Spacer } from '@/ui/Layout';
import { Text } from '@/ui/Text';

/** Steps up close (reference 2's big-number screen) plus the health connection. */
export default function StepsScreen() {
  const { width: windowWidth } = useWindowDimensions();
  const width = Math.min(windowWidth, MAX_WIDTH) - GUTTER * 2;
  const state = useStepsStore();
  const goal = useProfileStore((s) => s.stepGoal);
  const steps = currentSteps(state);
  const shown = useTween(steps, 900, 0);
  const pct = Math.round((steps / goal) * 100);
  const daysHit = state.week.filter((d) => d.steps >= goal).length;

  return (
    <Screen>
      <Row justify="space-between">
        <IconButton icon="arrow-left" accessibilityLabel="Back" onPress={() => router.back()} />
        {state.connected ? (
          <IconButton
            icon="sync"
            accessibilityLabel="Sync now"
            onPress={() => void syncHealth()}
          />
        ) : null}
      </Row>

      <Spacer size={space.xl} />
      <Text variant="title">Steps</Text>
      <Text variant="title" color={colors.inkSoft} style={{ fontFamily: fonts.display }}>
        Today
      </Text>

      <Spacer size={space.md} />
      <Row align="flex-end" gap={space.sm}>
        <Text variant="hero" adjustsFontSizeToFit numberOfLines={1} style={{ flexShrink: 1 }}>
          {state.connected ? formatNumber(shown) : '—'}
        </Text>
        <View style={{ paddingBottom: 18 }}>
          <Text variant="heading" style={{ fontFamily: fonts.displaySemi }}>
            STEPS
          </Text>
          <Text variant="label">{state.connected ? `${pct}% of ${formatNumber(goal / 1000)}k` : 'not synced'}</Text>
        </View>
      </Row>

      {state.connected ? (
        <>
          <View style={styles.badge}>
            <Text style={styles.badgeNumber}>{daysHit}</Text>
            <Text style={styles.badgeText}>{'DAYS AT\nGOAL'}</Text>
            <Icon name="arrow-up" color={colors.onTomato} size={22} />
          </View>

          <Spacer size={space.xl} />
          <Text variant="label">Last 7 days</Text>
          <Spacer size={space.sm} />
          <WeekBars
            width={width}
            goal={goal}
            bars={state.week.map((d) => ({
              label: weekdayLetter(fromDayKey(d.day)),
              value: d.steps,
              highlight: d.day === dayKey(),
            }))}
          />
        </>
      ) : null}

      <Spacer size={space.xl} />

      {/* source card, styled like reference 2's dark "THIS WEEK" bar */}
      <View style={styles.source}>
        <Row justify="space-between">
          <View style={{ flex: 1 }}>
            <Text variant="label" color="rgba(245,242,236,0.6)">
              Synced from
            </Text>
            <Text variant="heading" color={colors.cream}>
              {healthProvider.label}
            </Text>
            <Text variant="caption" color="rgba(245,242,236,0.6)">
              {state.connected
                ? `Updated ${timeAgo(state.lastSyncAt)}`
                : healthProvider.isDemo
                  ? 'Preview numbers — real sync needs the phone app'
                  : 'Reads your steps and weight. Nothing is written.'}
            </Text>
          </View>
          <View style={styles.sourceIcon}>
            {state.syncing ? <ActivityIndicator color={colors.ink} /> : <Icon name="heart" color={colors.ink} />}
          </View>
        </Row>
        {state.error ? (
          <Text variant="caption" color="#FF9AA2" style={{ marginTop: space.sm }}>
            {state.error}
          </Text>
        ) : null}
        <Spacer size={space.md} />
        {state.connected ? (
          <Row gap={space.sm}>
            {healthProvider.openSettings ? (
              <Button label="Permissions" tone="white" height={46} style={{ flex: 1 }} onPress={() => healthProvider.openSettings?.()} />
            ) : null}
            <Button label="Stop syncing" tone="white" height={46} style={{ flex: 1 }} onPress={disconnectHealth} />
          </Row>
        ) : (
          <Button
            label={healthProvider.isDemo ? 'Use demo steps' : `Connect ${healthProvider.label}`}
            tone="tomato"
            iconRight="arrow-right"
            onPress={() => void connectHealth()}
          />
        )}
      </View>

      {!state.connected ? (
        <Text variant="caption" style={{ marginTop: space.md }}>
          On iPhone this reads Apple Health. On Android it reads Health Connect, which is where Google Fit,
          Samsung Health and Fitbit share their steps.
        </Text>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.tomato,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  badgeNumber: {
    fontFamily: fonts.displayMedium,
    fontSize: 32,
    lineHeight: 36,
    color: colors.onTomato,
  },
  badgeText: {
    fontFamily: fonts.textSemi,
    fontSize: 12,
    lineHeight: 14,
    color: colors.onTomato,
  },
  source: {
    backgroundColor: colors.ink,
    borderRadius: radius.lg,
    padding: space.lg,
  },
  sourceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
