/**
 * Design tokens. The whole look of the app comes from this file:
 * three brand colours, two typefaces and one spacing scale.
 * Swap the values here to re-skin everything.
 */

/** The three brand colours. */
export const brand = {
  /** Plates, highlights, the "food" colour. */
  tomato: '#C1343F',
  /** Text, buttons, chips. */
  ink: '#141414',
  /** App background. */
  cream: '#F5F2EC',
} as const;

/** Everything else is derived from the three brand colours. */
export const colors = {
  ...brand,
  surface: '#FFFFFF',
  /** Darker tomato for pressed states and the plate rim shadow. */
  tomatoDeep: '#A12A34',
  /** Ink at reduced strength, for secondary text. */
  inkSoft: 'rgba(20,20,20,0.56)',
  inkFaint: 'rgba(20,20,20,0.32)',
  /** Hairlines and inactive chips. */
  line: 'rgba(20,20,20,0.08)',
  chip: '#E6E2DA',
  /** White on tomato, at three strengths. */
  onTomato: '#FFFFFF',
  onTomatoSoft: 'rgba(255,255,255,0.72)',
  onTomatoFaint: 'rgba(255,255,255,0.18)',
} as const;

/** Font family names, as registered in the root layout. */
export const fonts = {
  displayLight: 'Outfit_300Light',
  display: 'Outfit_400Regular',
  displayMedium: 'Outfit_500Medium',
  displaySemi: 'Outfit_600SemiBold',
  displayBold: 'Outfit_700Bold',
  text: 'Inter_400Regular',
  textMedium: 'Inter_500Medium',
  textSemi: 'Inter_600SemiBold',
} as const;

export const space = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 12,
  md: 18,
  lg: 24,
  xl: 32,
  pill: 999,
} as const;

/** Horizontal gutter for every screen. */
export const GUTTER = space.xl;

/** Phones look best capped at this width on tablets and the web preview. */
export const MAX_WIDTH = 480;
