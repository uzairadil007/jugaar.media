import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { haptic } from '@/lib/haptics';
import { colors, fonts, radius } from '@/theme/tokens';

import { Icon, type IconName } from './Icon';
import { Text } from './Text';

/* ───────────── Round icon button (the circles in both references) ───────────── */

type IconButtonTone = 'soft' | 'ink' | 'white' | 'ghost' | 'glass';

const iconButtonTones: Record<IconButtonTone, { bg: string; fg: string }> = {
  soft: { bg: '#EAE6DF', fg: colors.ink },
  ink: { bg: colors.ink, fg: colors.cream },
  white: { bg: colors.surface, fg: colors.ink },
  ghost: { bg: 'transparent', fg: colors.ink },
  glass: { bg: 'rgba(255,255,255,0.18)', fg: colors.onTomato },
};

export function IconButton({
  icon,
  onPress,
  tone = 'soft',
  size = 52,
  iconSize,
  color,
  accessibilityLabel,
  style,
}: {
  icon: IconName;
  onPress?: () => void;
  tone?: IconButtonTone;
  size?: number;
  iconSize?: number;
  color?: string;
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
}) {
  const t = iconButtonTones[tone];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      onPress={() => {
        haptic.tap();
        onPress?.();
      }}
      style={({ pressed }) => [
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: t.bg,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: pressed ? 0.7 : 1,
          transform: [{ scale: pressed ? 0.96 : 1 }],
        },
        style,
      ]}>
      <Icon name={icon} color={color ?? t.fg} size={iconSize ?? Math.round(size * 0.42)} />
    </Pressable>
  );
}

/* ───────────── Chips (the GM / BSN / LAB pills) ───────────── */

export function Chip({
  label,
  selected,
  onPress,
  tone = 'light',
  grow,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  /** `onTomato` for chips that sit on a red surface. */
  tone?: 'light' | 'onTomato';
  /** Share the row equally with sibling chips (segmented-control look). */
  grow?: boolean;
}) {
  const onRed = tone === 'onTomato';
  const bg = selected ? (onRed ? colors.onTomato : colors.ink) : onRed ? colors.onTomatoFaint : colors.chip;
  const fg = selected ? (onRed ? colors.tomato : colors.cream) : onRed ? colors.onTomato : colors.inkSoft;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      onPress={() => {
        haptic.select();
        onPress?.();
      }}
      style={({ pressed }) => [
        styles.chip,
        grow && styles.chipGrow,
        { backgroundColor: bg, opacity: pressed ? 0.75 : 1 },
      ]}>
      <Text style={[styles.chipText, { color: fg }]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

/* ───────────── Pill buttons ───────────── */

type ButtonTone = 'ink' | 'outline' | 'tomato' | 'white';

export function Button({
  label,
  onPress,
  tone = 'ink',
  iconLeft,
  iconRight,
  disabled,
  flushRight,
  style,
  height = 56,
}: {
  label: string;
  onPress?: () => void;
  tone?: ButtonTone;
  iconLeft?: IconName;
  iconRight?: IconName;
  disabled?: boolean;
  /** Square off the right side so the button runs into the screen edge (reference 1's "Add to cart"). */
  flushRight?: boolean;
  style?: StyleProp<ViewStyle>;
  height?: number;
}) {
  const palette: Record<ButtonTone, { bg: string; fg: string; border: string }> = {
    ink: { bg: colors.ink, fg: colors.cream, border: colors.ink },
    outline: { bg: 'transparent', fg: colors.ink, border: colors.ink },
    tomato: { bg: colors.tomato, fg: colors.onTomato, border: colors.tomato },
    white: { bg: colors.surface, fg: colors.ink, border: colors.surface },
  };
  const c = palette[tone];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={() => {
        haptic.tap();
        onPress?.();
      }}
      style={({ pressed }) => [
        styles.button,
        {
          height,
          backgroundColor: c.bg,
          borderColor: c.border,
          opacity: disabled ? 0.35 : pressed ? 0.8 : 1,
        },
        flushRight && styles.flushRight,
        style,
      ]}>
      {iconLeft ? <ButtonIcon name={iconLeft} color={c.fg} outlined={tone === 'outline'} /> : null}
      <Text style={[styles.buttonText, { color: c.fg }]}>{label}</Text>
      {iconRight ? <Icon name={iconRight} color={c.fg} size={20} /> : null}
    </Pressable>
  );
}

function ButtonIcon({ name, color, outlined }: { name: IconName; color: string; outlined: boolean }) {
  // The "⊕ ADD TO DIET" look: the icon sits inside its own thin circle.
  if (!outlined) return <Icon name={name} color={color} size={20} />;
  return (
    <View style={[styles.iconRing, { borderColor: color }]}>
      <Icon name={name} color={color} size={16} />
    </View>
  );
}

/* ───────────── Stepper ───────────── */

export function Stepper({
  value,
  onDecrement,
  onIncrement,
  children,
  tone = 'light',
}: {
  value?: string;
  onDecrement: () => void;
  onIncrement: () => void;
  children?: ReactNode;
  tone?: 'light' | 'white';
}) {
  return (
    <View style={styles.stepper}>
      <IconButton
        icon="minus"
        tone={tone === 'white' ? 'white' : 'soft'}
        size={44}
        onPress={onDecrement}
        accessibilityLabel="Decrease"
      />
      <View style={styles.stepperValue}>
        {children ?? <Text variant="heading">{value}</Text>}
      </View>
      <IconButton
        icon="plus"
        tone={tone === 'white' ? 'white' : 'soft'}
        size={44}
        onPress={onIncrement}
        accessibilityLabel="Increase"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 38,
    paddingHorizontal: 15,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipGrow: {
    flex: 1,
    paddingHorizontal: 4,
  },
  chipText: {
    fontFamily: fonts.textSemi,
    fontSize: 13,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 26,
    borderRadius: radius.pill,
    borderWidth: 1.5,
  },
  flushRight: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderRightWidth: 0,
  },
  buttonText: {
    fontFamily: fonts.textSemi,
    fontSize: 14,
    letterSpacing: 0.4,
  },
  iconRing: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepperValue: {
    flex: 1,
    alignItems: 'center',
  },
});
