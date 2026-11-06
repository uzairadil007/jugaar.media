import type { ReactNode } from 'react';
import {
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fonts, GUTTER, MAX_WIDTH, radius, space } from '@/theme/tokens';

import { Text } from './Text';

/* ───────────── Screen ───────────── */

/**
 * Base screen: cream background, safe-area padding, and a width cap so the
 * layout stays phone-shaped on tablets and in the web preview.
 */
export function Screen({
  children,
  scroll = true,
  background = colors.cream,
  padded = true,
  footer,
  contentStyle,
  edges = { top: true, bottom: true },
}: {
  children: ReactNode;
  scroll?: boolean;
  background?: string;
  padded?: boolean;
  /** Pinned to the bottom, above the home indicator. */
  footer?: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  edges?: { top?: boolean; bottom?: boolean };
}) {
  const insets = useSafeAreaInsets();
  const top = edges.top ? insets.top + space.xs : 0;
  const bottom = edges.bottom ? Math.max(insets.bottom, space.md) : 0;

  const inner = [
    styles.inner,
    padded && { paddingHorizontal: GUTTER },
    { paddingTop: top, paddingBottom: footer ? space.md : bottom + space.md },
    contentStyle,
  ];

  return (
    <View style={[styles.root, { backgroundColor: background }]}>
      <View style={styles.column}>
        {scroll ? (
          <ScrollView
            style={styles.flex}
            contentContainerStyle={inner}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.flex, ...inner]}>{children}</View>
        )}
        {footer ? (
          <View
            style={[
              styles.footer,
              { paddingBottom: bottom, backgroundColor: background },
              padded && { paddingHorizontal: GUTTER },
            ]}>
            {footer}
          </View>
        ) : null}
      </View>
    </View>
  );
}

/* ───────────── Card ───────────── */

export function Card({
  children,
  style,
  tone = 'white',
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  tone?: 'white' | 'ink' | 'tomato';
}) {
  const bg = tone === 'ink' ? colors.ink : tone === 'tomato' ? colors.tomato : colors.surface;
  return <View style={[styles.card, { backgroundColor: bg }, style]}>{children}</View>;
}

/* ───────────── Row helpers ───────────── */

export function Row({
  children,
  gap = space.sm,
  style,
  align = 'center',
  justify = 'flex-start',
}: {
  children: ReactNode;
  gap?: number;
  style?: StyleProp<ViewStyle>;
  align?: ViewStyle['alignItems'];
  justify?: ViewStyle['justifyContent'];
}) {
  return (
    <View style={[{ flexDirection: 'row', alignItems: align, justifyContent: justify, gap }, style]}>
      {children}
    </View>
  );
}

export function Spacer({ size = space.md }: { size?: number }) {
  return <View style={{ height: size }} />;
}

/* ───────────── Text field ───────────── */

export function Field({
  label,
  suffix,
  style,
  ...input
}: TextInputProps & { label: string; suffix?: string; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.field, style]}>
      <Text variant="label">{label}</Text>
      <View style={styles.fieldRow}>
        <TextInput
          placeholderTextColor={colors.inkFaint}
          {...input}
          style={styles.fieldInput}
        />
        {suffix ? <Text variant="caption">{suffix}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
  },
  column: {
    flex: 1,
    width: '100%',
    maxWidth: MAX_WIDTH,
  },
  flex: {
    flex: 1,
  },
  inner: {
    flexGrow: 1,
  },
  footer: {
    paddingTop: space.sm,
  },
  card: {
    borderRadius: radius.lg,
    padding: space.lg,
  },
  field: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    paddingTop: space.sm,
    paddingBottom: space.xs,
    gap: 2,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  fieldInput: {
    flex: 1,
    minWidth: 0,
    fontFamily: fonts.displayMedium,
    fontSize: 20,
    color: colors.ink,
    paddingVertical: 6,
    outlineWidth: 0,
  },
});
