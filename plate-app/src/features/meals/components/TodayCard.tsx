import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { useProfileStore } from '@/features/profile/store';
import { dayKey } from '@/lib/date';
import { formatNumber } from '@/lib/format';
import { useTween } from '@/lib/useTween';
import { colors, fonts, radius } from '@/theme/tokens';
import { NotchCard } from '@/ui/NotchCard';
import { Text } from '@/ui/Text';

import { SLOTS } from '../slots';
import { entriesForDay, totalsOf, useMealsStore } from '../store';
import { Plate } from './Plate';

/** Home screen: calories eaten today, with the whole day as one plate. */
export function TodayCard() {
  const entries = useMealsStore((s) => s.entries);
  const goal = useProfileStore((s) => s.calorieGoal);
  const today = entriesForDay(entries, dayKey());
  const { kcal } = totalsOf(today);
  const shown = useTween(kcal, 900, 0);
  const left = goal - kcal;

  return (
    <NotchCard
      onPress={() => router.push('/meals')}
      notchIcon="arrow-down"
      notchLabel="Open today's plates">
      <View style={styles.row}>
        <View style={styles.text}>
          <Text variant="label" color={colors.onTomatoSoft}>
            Eaten today
          </Text>
          <Text style={styles.big}>{formatNumber(shown)}</Text>
          <Text variant="label" color={colors.onTomatoSoft}>
            of {formatNumber(goal)} kcal
          </Text>

          <View style={styles.leftPill}>
            <Text style={styles.leftText}>
              {left >= 0 ? `${formatNumber(left)} left` : `${formatNumber(-left)} over`}
            </Text>
          </View>

          <View style={styles.slots}>
            {SLOTS.map((slot) => {
              const has = today.some((e) => e.slot === slot.id);
              return (
                <View key={slot.id} style={[styles.slotDot, has && styles.slotDotOn]}>
                  <Text style={[styles.slotLetter, has && styles.slotLetterOn]}>{slot.label[0]}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <Plate items={today} target={goal} size={150} />
      </View>
    </NotchCard>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  text: {
    flex: 1,
  },
  big: {
    fontFamily: fonts.displayLight,
    fontSize: 58,
    lineHeight: 64,
    letterSpacing: -2.5,
    color: colors.onTomato,
    marginTop: 6,
  },
  leftPill: {
    alignSelf: 'flex-start',
    marginTop: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.onTomatoFaint,
  },
  leftText: {
    fontFamily: fonts.textSemi,
    fontSize: 12,
    color: colors.onTomato,
  },
  slots: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 14,
  },
  slotDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotDotOn: {
    backgroundColor: colors.onTomato,
    borderColor: colors.onTomato,
  },
  slotLetter: {
    fontFamily: fonts.textSemi,
    fontSize: 11,
    color: 'rgba(255,255,255,0.75)',
  },
  slotLetterOn: {
    color: colors.tomato,
  },
});
