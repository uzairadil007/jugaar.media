import { router } from 'expo-router';
import { Pressable, View, useWindowDimensions } from 'react-native';

import { tileStyles as styles } from '@/features/steps/StepsTile';
import { useProfileStore } from '@/features/profile/store';
import { formatShortDate } from '@/lib/date';
import { formatWeight, kgToUnit } from '@/lib/format';
import { colors, GUTTER, MAX_WIDTH } from '@/theme/tokens';
import { Sparkline } from '@/ui/Charts';
import { Icon } from '@/ui/Icon';
import { Text } from '@/ui/Text';

import { useWeightStore, weightLost } from './store';

/** Home screen: how much weight has come off since day one. */
export function LostTile() {
  const weighIns = useWeightStore((s) => s.weighIns);
  const start = useProfileStore((s) => s.startWeightKg);
  const unit = useProfileStore((s) => s.unit);
  const { width } = useWindowDimensions();

  const lost = weightLost(start, weighIns);
  const tileWidth = (Math.min(width, MAX_WIDTH) - GUTTER * 2 - 12) / 2;
  const values = weighIns.slice(-8).map((w) => kgToUnit(w.kg, unit));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Weight lost"
      onPress={() => router.push('/weight')}
      style={({ pressed }) => [styles.tile, pressed && { opacity: 0.85 }]}>
      <View style={styles.head}>
        <View style={styles.icon}>
          <Icon name="scale" size={18} />
        </View>
        <Text variant="label">{lost < 0 ? 'Gained' : 'Lost'}</Text>
      </View>

      {weighIns.length ? (
        <>
          <Text style={styles.number}>
            {formatWeight(Math.abs(lost), unit)}
            <Text variant="caption"> {unit}</Text>
          </Text>
          <View style={styles.foot}>
            <Sparkline values={values} width={tileWidth - 36} height={26} />
            <Text variant="caption">since {formatShortDate(weighIns[0].at)}</Text>
          </View>
        </>
      ) : (
        <>
          <Text style={[styles.number, { color: colors.inkFaint }]}>0.0</Text>
          <View style={styles.foot}>
            <Text variant="caption" numberOfLines={2}>
              Tap to log your weight
            </Text>
          </View>
        </>
      )}
    </Pressable>
  );
}
