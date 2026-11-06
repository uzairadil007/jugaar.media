import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radius } from '@/theme/tokens';

import { IconButton } from './Buttons';
import type { IconName } from './Icon';

const RING = 10;

/**
 * The red card from reference 1: rounded block of colour with a round
 * black button sitting in a notch cut out of its bottom edge.
 * The notch is a circle filled with the page background, so `notchBg`
 * must match whatever sits behind the card.
 */
export function NotchCard({
  children,
  onPress,
  notchIcon = 'arrow-down',
  onNotchPress,
  notchLabel,
  notchSize = 60,
  notchBg = colors.cream,
  tone = 'tomato',
  style,
  cardStyle,
}: {
  children: ReactNode;
  onPress?: () => void;
  notchIcon?: IconName;
  onNotchPress?: () => void;
  notchLabel: string;
  notchSize?: number;
  notchBg?: string;
  tone?: 'tomato' | 'ink';
  style?: StyleProp<ViewStyle>;
  cardStyle?: StyleProp<ViewStyle>;
}) {
  const outer = notchSize + RING * 2;
  const bg = tone === 'ink' ? colors.ink : colors.tomato;

  return (
    <View style={[{ paddingBottom: outer / 2 }, style]}>
      <Pressable
        onPress={onPress}
        disabled={!onPress}
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: bg, paddingBottom: outer / 2 + 14 },
          pressed && { opacity: 0.94 },
          cardStyle,
        ]}>
        {children}
      </Pressable>
      <View
        style={[
          styles.notch,
          { width: outer, height: outer, borderRadius: outer / 2, backgroundColor: notchBg },
        ]}>
        <IconButton
          icon={notchIcon}
          tone="ink"
          size={notchSize}
          onPress={onNotchPress ?? onPress}
          accessibilityLabel={notchLabel}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    padding: 24,
    overflow: 'hidden',
  },
  notch: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
