import { Pressable, StyleSheet, View } from 'react-native';

import { formatNumber } from '@/lib/format';
import { colors, fonts, radius } from '@/theme/tokens';
import { Icon, type IconName } from '@/ui/Icon';
import { Text } from '@/ui/Text';

/**
 * A food in a list: emoji bubble, name, details line, calories and an
 * optional trailing action (add / remove / done).
 */
export function FoodRow({
  emoji,
  name,
  detail,
  kcal,
  action,
  onAction,
  onPress,
  actionLabel,
  actionTone = 'soft',
}: {
  emoji: string;
  name: string;
  detail: string;
  kcal: number;
  action?: IconName;
  onAction?: () => void;
  onPress?: () => void;
  actionLabel?: string;
  actionTone?: 'soft' | 'ink' | 'tomato';
}) {
  const actionBg =
    actionTone === 'ink' ? colors.ink : actionTone === 'tomato' ? colors.tomato : '#EFECE6';
  const actionFg = actionTone === 'soft' ? colors.ink : colors.cream;

  return (
    <Pressable onPress={onPress} disabled={!onPress} style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}>
      <View style={styles.bubble}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
      <View style={styles.body}>
        <Text variant="bodyStrong" numberOfLines={1}>
          {name}
        </Text>
        <Text variant="caption" numberOfLines={1}>
          {detail}
        </Text>
      </View>
      <Text style={styles.kcal}>
        {formatNumber(kcal)}
        <Text variant="caption"> kcal</Text>
      </Text>
      {action ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          hitSlop={10}
          onPress={onAction}
          style={({ pressed }) => [styles.action, { backgroundColor: actionBg, opacity: pressed ? 0.7 : 1 }]}>
          <Icon name={action} size={16} color={actionFg} strokeWidth={2} />
        </Pressable>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  bubble: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 22,
    lineHeight: 28,
  },
  body: {
    flex: 1,
    gap: 2,
  },
  kcal: {
    fontFamily: fonts.displayMedium,
    fontSize: 16,
    color: colors.ink,
  },
  action: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
