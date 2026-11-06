import { StyleSheet, View } from 'react-native';

import { formatNumber } from '@/lib/format';
import { colors } from '@/theme/tokens';
import { NotchCard } from '@/ui/NotchCard';
import { Text } from '@/ui/Text';

import type { SlotInfo } from '../slots';
import type { FoodEntry } from '../types';
import { Plate, plateCenter } from './Plate';

/**
 * One meal as a red card (reference 1): small label, bold title, the plate in
 * the middle, and the round black button in the notch to add food to it.
 */
export function MealCard({
  slot,
  entries,
  target,
  width,
  onOpen,
  onAdd,
}: {
  slot: SlotInfo;
  entries: FoodEntry[];
  target: number;
  width: number;
  onOpen: () => void;
  onAdd: () => void;
}) {
  const kcal = entries.reduce((s, e) => s + e.kcal, 0);
  const summary = entries.length
    ? entries
        .slice(0, 2)
        .map((e) => e.name)
        .join(', ') + (entries.length > 2 ? ` +${entries.length - 2}` : '')
    : 'Empty plate';
  const plateSize = Math.round(width * 0.74);

  return (
    <NotchCard
      onPress={onOpen}
      onNotchPress={onAdd}
      notchIcon="plus"
      notchLabel={`Add food to ${slot.label}`}
      style={{ width }}>
      <Text variant="label" color={colors.onTomatoSoft}>
        {slot.label} · {slot.window}
      </Text>
      <Text variant="heading" color={colors.onTomato} style={styles.title} numberOfLines={2}>
        {summary}
      </Text>

      <View style={styles.plate}>
        <Plate
          items={entries}
          target={target}
          size={plateSize}
          {...(entries.length ? plateCenter(kcal, target, true) : {})}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.kcal} color={colors.onTomato}>
          {formatNumber(kcal)}
        </Text>
        <Text variant="label" color={colors.onTomatoSoft}>
          / {formatNumber(target)} kcal
        </Text>
      </View>
    </NotchCard>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: 6,
    minHeight: 50,
  },
  plate: {
    alignItems: 'center',
    marginTop: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: 6,
    marginTop: 14,
  },
  kcal: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 22,
  },
});
