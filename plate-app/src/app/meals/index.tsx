import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { Animated, FlatList, Platform, StyleSheet, useWindowDimensions, View } from 'react-native';

import { MealCard } from '@/features/meals/components/MealCard';
import { isMealSlot, slotForTime, SLOTS, slotTarget } from '@/features/meals/slots';
import { entriesForDay, entriesForSlot, totalsOf, useMealsStore } from '@/features/meals/store';
import type { MealSlot } from '@/features/meals/types';
import { useProfileStore } from '@/features/profile/store';
import { addDays, dayKey, fromDayKey, isToday, relativeDay } from '@/lib/date';
import { haptic } from '@/lib/haptics';
import { formatNumber } from '@/lib/format';
import { colors, fonts, GUTTER, MAX_WIDTH, radius, space } from '@/theme/tokens';
import { Chip, IconButton } from '@/ui/Buttons';
import { ProgressBar } from '@/ui/Charts';
import { Row, Screen, Spacer } from '@/ui/Layout';
import { Text } from '@/ui/Text';

const GAP = 14;
const useNativeDriver = Platform.OS !== 'web';

/**
 * The plates (reference 1's "Category" screen): a swipeable row of red cards,
 * one per meal, with chips on top to jump between them.
 */
export default function PlatesScreen() {
  const params = useLocalSearchParams<{ day?: string; slot?: string }>();
  const { width: windowWidth } = useWindowDimensions();
  const width = Math.min(windowWidth, MAX_WIDTH);
  const cardWidth = Math.round(width * 0.68);
  const step = cardWidth + GAP;
  const sidePad = (width - cardWidth) / 2;

  const [day, setDay] = useState(params.day ?? dayKey());
  const initialSlot: MealSlot = isMealSlot(params.slot)
    ? params.slot
    : isToday(day)
      ? slotForTime(new Date())
      : 'breakfast';
  const initialIndex = SLOTS.findIndex((s) => s.id === initialSlot);
  const [active, setActive] = useState(initialIndex);

  const entries = useMealsStore((s) => s.entries);
  const goal = useProfileStore((s) => s.calorieGoal);
  const dayEntries = entriesForDay(entries, day);
  const totals = totalsOf(dayEntries);

  const [scrollX] = useState(() => new Animated.Value(initialIndex * step));
  const listRef = useRef<FlatList>(null);

  const goTo = (index: number) => {
    setActive(index);
    listRef.current?.scrollToOffset({ offset: index * step, animated: true });
  };

  const shiftDay = (delta: number) => {
    const next = dayKey(addDays(fromDayKey(day), delta));
    if (next > dayKey()) return;
    haptic.select();
    setDay(next);
  };

  return (
    <Screen padded={false}>
      <Row justify="space-between" style={styles.header}>
        <IconButton icon="arrow-left" accessibilityLabel="Back" onPress={() => router.back()} />
        <View style={styles.headerTitle}>
          <Text variant="bodyStrong">Plates</Text>
          <Row gap={2}>
            <IconButton icon="chevron-left" tone="ghost" size={28} accessibilityLabel="Previous day" onPress={() => shiftDay(-1)} />
            <Text variant="caption" style={styles.dayLabel}>
              {relativeDay(day)}
            </Text>
            <IconButton
              icon="chevron-right"
              tone="ghost"
              size={28}
              color={isToday(day) ? colors.inkFaint : colors.ink}
              accessibilityLabel="Next day"
              onPress={() => shiftDay(1)}
            />
          </Row>
        </View>
        <IconButton
          icon="plus"
          tone="ink"
          accessibilityLabel="Add food"
          onPress={() =>
            router.push({ pathname: '/add-food', params: { slot: SLOTS[active].id, day } })
          }
        />
      </Row>

      <Spacer size={space.lg} />

      <Row gap={8} justify="center" style={{ paddingHorizontal: GUTTER, flexWrap: 'wrap' }}>
        {SLOTS.map((s, i) => (
          <Chip key={s.id} label={s.label} selected={i === active} onPress={() => goTo(i)} />
        ))}
      </Row>

      <Spacer size={space.xl} />

      <Animated.FlatList
        ref={listRef}
        data={SLOTS}
        keyExtractor={(s) => s.id}
        horizontal
        style={{ flexGrow: 0 }}
        showsHorizontalScrollIndicator={false}
        snapToInterval={step}
        decelerationRate="fast"
        disableIntervalMomentum
        contentContainerStyle={{ paddingHorizontal: sidePad, gap: GAP }}
        initialScrollIndex={initialIndex}
        getItemLayout={(_, index) => ({ length: step, offset: step * index, index })}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver,
        })}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / step);
          if (index !== active) haptic.select();
          setActive(Math.max(0, Math.min(SLOTS.length - 1, index)));
        }}
        onScrollEndDrag={(e) => {
          // Web has no momentum events; settle the active card here instead.
          if (Platform.OS === 'web') setActive(Math.round(e.nativeEvent.contentOffset.x / step));
        }}
        renderItem={({ item, index }) => {
          const inputRange = [(index - 1) * step, index * step, (index + 1) * step];
          const opacity = scrollX.interpolate({ inputRange, outputRange: [0.55, 1, 0.55], extrapolate: 'clamp' });
          const scale = scrollX.interpolate({ inputRange, outputRange: [0.92, 1, 0.92], extrapolate: 'clamp' });
          return (
            <Animated.View style={{ opacity, transform: [{ scale }] }}>
              <MealCard
                slot={item}
                width={cardWidth}
                entries={entriesForSlot(entries, day, item.id)}
                target={slotTarget(item.id, goal)}
                onOpen={() => router.push({ pathname: '/meals/[slot]', params: { slot: item.id, day } })}
                onAdd={() => router.push({ pathname: '/add-food', params: { slot: item.id, day } })}
              />
            </Animated.View>
          );
        }}
      />

      <Row gap={8} justify="center" style={{ marginTop: space.md }}>
        {SLOTS.map((s, i) => (
          <View key={s.id} style={[styles.dot, i === active && styles.dotActive]} />
        ))}
      </Row>

      <Spacer size={space.xl} />
      <View style={{ flex: 1 }} />

      <View style={styles.summary}>
        <Row justify="space-between" align="flex-end">
          <View>
            <Text variant="label">{relativeDay(day)} total</Text>
            <Text style={styles.total}>
              {formatNumber(totals.kcal)}
              <Text variant="caption"> / {formatNumber(goal)} kcal</Text>
            </Text>
          </View>
          <Text variant="caption">{dayEntries.length} items</Text>
        </Row>
        <Spacer size={space.md} />
        <Row gap={space.md}>
          <Macro label="Protein" grams={totals.protein} goal={(goal * 0.3) / 4} />
          <Macro label="Carbs" grams={totals.carbs} goal={(goal * 0.45) / 4} />
          <Macro label="Fat" grams={totals.fat} goal={(goal * 0.25) / 9} />
        </Row>
      </View>
    </Screen>
  );
}

function Macro({ label, grams, goal }: { label: string; grams: number; goal: number }) {
  return (
    <View style={{ flex: 1, gap: 6 }}>
      <Row justify="space-between">
        <Text variant="label">{label}</Text>
        <Text variant="caption" color={colors.ink}>
          {Math.round(grams)}g
        </Text>
      </Row>
      <ProgressBar progress={grams / goal} height={5} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: GUTTER,
  },
  headerTitle: {
    alignItems: 'center',
  },
  dayLabel: {
    minWidth: 72,
    textAlign: 'center',
    color: colors.ink,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.inkFaint,
  },
  dotActive: {
    backgroundColor: colors.ink,
    width: 18,
  },
  summary: {
    marginHorizontal: GUTTER,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: space.lg,
  },
  total: {
    fontFamily: fonts.displayLight,
    fontSize: 32,
    letterSpacing: -1,
    color: colors.ink,
    marginTop: 4,
  },
});
