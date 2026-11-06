import { router, useLocalSearchParams } from 'expo-router';
import { Alert, Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FoodRow } from '@/features/meals/components/FoodRow';
import { Plate, plateCenter } from '@/features/meals/components/Plate';
import { isMealSlot, slotInfo, slotTarget } from '@/features/meals/slots';
import { entriesForSlot, totalsOf, useMealsStore } from '@/features/meals/store';
import type { FoodEntry } from '@/features/meals/types';
import { useProfileStore } from '@/features/profile/store';
import { dayKey, formatTime, relativeDay } from '@/lib/date';
import { formatNumber } from '@/lib/format';
import { haptic } from '@/lib/haptics';
import { colors, fonts, GUTTER, MAX_WIDTH, space } from '@/theme/tokens';
import { Button, IconButton } from '@/ui/Buttons';
import { Row, Screen, Spacer } from '@/ui/Layout';
import { Text } from '@/ui/Text';

/**
 * One plate up close (reference 1's product screen): red top with the meal
 * name and calories, the plate sitting on the fold, and what's on it below.
 */
export default function PlateDetailScreen() {
  const params = useLocalSearchParams<{ slot: string; day?: string }>();
  const slot = isMealSlot(params.slot) ? params.slot : 'breakfast';
  const day = params.day ?? dayKey();
  const info = slotInfo(slot);
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const width = Math.min(windowWidth, MAX_WIDTH);

  const entries = useMealsStore((s) => s.entries);
  const remove = useMealsStore((s) => s.remove);
  const goal = useProfileStore((s) => s.calorieGoal);
  const items = entriesForSlot(entries, day, slot);
  const totals = totalsOf(items);
  const target = slotTarget(slot, goal);
  const pct = Math.round((totals.kcal / target) * 100);
  const plateSize = Math.round(width * 0.62);

  const confirmRemove = (entry: FoodEntry) => {
    const doRemove = () => {
      haptic.warn();
      remove(entry.id);
    };
    if (Platform.OS === 'web') return doRemove();
    Alert.alert(`Remove ${entry.name}?`, undefined, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: doRemove },
    ]);
  };

  return (
    <Screen padded={false} edges={{ top: false, bottom: true }} background={colors.surface}>
      {/* red top half */}
      <View style={[styles.hero, { paddingTop: insets.top + space.xs, paddingBottom: plateSize / 2 + 32 + space.lg }]}>
        <Row justify="space-between">
          <IconButton icon="arrow-left" tone="glass" accessibilityLabel="Back" onPress={() => router.back()} />
          <IconButton
            icon="plus"
            tone="white"
            accessibilityLabel={`Add food to ${info.label}`}
            onPress={() => router.push({ pathname: '/add-food', params: { slot, day } })}
          />
        </Row>

        <Spacer size={space.xl} />
        <Text variant="label" color={colors.onTomatoSoft}>
          {relativeDay(day)} · {info.window}
        </Text>
        <Text variant="title" color={colors.onTomato} style={{ fontSize: 40, lineHeight: 44 }}>
          {info.label.toUpperCase()}
        </Text>

        <Spacer size={space.lg} />
        <Text style={styles.kcal}>
          {formatNumber(totals.kcal)}
          <Text style={styles.kcalUnit}> kcal</Text>
        </Text>
        <Text variant="label" color={colors.onTomatoSoft}>
          {pct >= 100 ? (pct > 105 ? `Over by ${formatNumber(totals.kcal - target)} kcal` : 'Plate full') : `${pct}% of a ${formatNumber(target)} kcal plate`}
        </Text>
      </View>

      {/* white panel with the plate sitting on its top edge */}
      <View style={styles.panel}>
        <View style={[styles.plateWrap, { marginTop: -plateSize / 2 }]}>
          <View style={[styles.plateShadow, { width: plateSize, height: plateSize, borderRadius: plateSize / 2 }]}>
            <Plate
              items={items}
              target={target}
              size={plateSize}
              tone="ceramic"
              {...plateCenter(totals.kcal, target, items.length > 0)}
            />
          </View>
        </View>

        <Spacer size={space.xl} />

        {/* macros + flush-right add button */}
        <Row justify="space-between" style={{ paddingLeft: GUTTER }}>
          <View style={{ flex: 1 }}>
            <Text variant="heading">{items.length ? `${items.length} on this plate` : 'Nothing here yet'}</Text>
            <Text variant="caption">
              P {Math.round(totals.protein)}g · C {Math.round(totals.carbs)}g · F {Math.round(totals.fat)}g
            </Text>
          </View>
          <Button
            label="Add food"
            iconRight="check"
            flushRight
            height={50}
            onPress={() => router.push({ pathname: '/add-food', params: { slot, day } })}
          />
        </Row>

        <Spacer size={space.md} />

        <View style={{ paddingHorizontal: GUTTER }}>
          {items.length === 0 ? (
            <Text variant="body" color={colors.inkSoft} style={{ marginTop: space.xs }}>
              Add what you ate and when. Every food becomes a slice of the plate until it&apos;s full.
            </Text>
          ) : (
            items.map((e) => (
              <FoodRow
                key={e.id}
                emoji={e.emoji}
                name={e.name}
                detail={`${formatTime(e.eatenAt)} · ${e.portion}`}
                kcal={e.kcal}
                action="trash"
                actionLabel={`Remove ${e.name}`}
                onAction={() => confirmRemove(e)}
              />
            ))
          )}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.tomato,
    paddingHorizontal: GUTTER,
  },
  panel: {
    marginTop: -32,
    paddingTop: 32,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  kcal: {
    fontFamily: fonts.displaySemi,
    fontSize: 28,
    color: colors.onTomato,
  },
  kcalUnit: {
    fontFamily: fonts.textSemi,
    fontSize: 13,
    color: colors.onTomatoSoft,
  },
  plateWrap: {
    alignItems: 'center',
  },
  plateShadow: {
    backgroundColor: colors.surface,
    shadowColor: '#5A1018',
    shadowOpacity: 0.22,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
    elevation: 12,
  },
});
