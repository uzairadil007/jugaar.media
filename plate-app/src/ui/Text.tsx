import { Text as RNText, StyleSheet, type TextProps } from 'react-native';

import { colors, fonts } from '@/theme/tokens';

/**
 * Typography scale.
 *  - hero / display: big thin Outfit numbers (the "256 KCAL" look)
 *  - title / heading: bold Outfit headings (the "SYNTHA-6" look)
 *  - body / caption: Inter for reading
 *  - label: small spaced capitals (the "PROTEIN" look)
 */
export type TextVariant =
  | 'hero'
  | 'display'
  | 'number'
  | 'title'
  | 'heading'
  | 'body'
  | 'bodyStrong'
  | 'caption'
  | 'label';

type Props = TextProps & {
  variant?: TextVariant;
  color?: string;
  align?: 'left' | 'center' | 'right';
};

export function Text({ variant = 'body', color, align, style, ...rest }: Props) {
  return (
    <RNText
      {...rest}
      style={[styles[variant], color ? { color } : null, align ? { textAlign: align } : null, style]}
    />
  );
}

const styles = StyleSheet.create({
  hero: {
    fontFamily: fonts.displayLight,
    fontSize: 104,
    lineHeight: 108,
    letterSpacing: -4,
    color: colors.ink,
  },
  display: {
    fontFamily: fonts.displayLight,
    fontSize: 56,
    lineHeight: 60,
    letterSpacing: -2,
    color: colors.ink,
  },
  number: {
    fontFamily: fonts.displayLight,
    fontSize: 38,
    lineHeight: 42,
    letterSpacing: -1.2,
    color: colors.ink,
  },
  title: {
    fontFamily: fonts.displayBold,
    fontSize: 34,
    lineHeight: 38,
    letterSpacing: -0.6,
    color: colors.ink,
  },
  heading: {
    fontFamily: fonts.displaySemi,
    fontSize: 20,
    lineHeight: 25,
    letterSpacing: -0.2,
    color: colors.ink,
  },
  body: {
    fontFamily: fonts.text,
    fontSize: 15,
    lineHeight: 21,
    color: colors.ink,
  },
  bodyStrong: {
    fontFamily: fonts.textSemi,
    fontSize: 15,
    lineHeight: 21,
    color: colors.ink,
  },
  caption: {
    fontFamily: fonts.textMedium,
    fontSize: 12,
    lineHeight: 16,
    color: colors.inkSoft,
  },
  label: {
    fontFamily: fonts.textSemi,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    color: colors.inkSoft,
  },
});
