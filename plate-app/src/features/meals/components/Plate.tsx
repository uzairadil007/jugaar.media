import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { useTween } from '@/lib/useTween';
import { colors, fonts } from '@/theme/tokens';
import { Text } from '@/ui/Text';

export type PlateItem = { id: string; kcal: number; emoji?: string };

type Tone = 'onTomato' | 'ceramic';

/**
 * A plate seen from above. Every food logged becomes a slice of the plate,
 * sized by its calories against the plate's target, so the plate fills up
 * as the meal is logged and is "full" when the target is reached.
 *
 *  - `onTomato`: drawn in white for the red cards
 *  - `ceramic`: a white plate with red slices, for light backgrounds
 */
export function Plate({
  items,
  target,
  size = 200,
  tone = 'onTomato',
  showEmoji = true,
  centerLabel,
  centerCaption,
}: {
  items: PlateItem[];
  target: number;
  size?: number;
  tone?: Tone;
  showEmoji?: boolean;
  centerLabel?: string;
  centerCaption?: string;
}) {
  const total = items.reduce((sum, i) => sum + i.kcal, 0);
  const fill = target > 0 ? total / target : 0;
  const isFull = fill >= 0.98;

  // When the plate overflows, slices share the whole plate in proportion.
  const scale = fill > 1 ? 1 / total : 1 / Math.max(target, 1);
  const slices: (PlateItem & { start: number; end: number })[] = [];
  let cursor = 0;
  for (const item of items) {
    const sweep = item.kcal * scale * 360;
    slices.push({ ...item, start: cursor, end: cursor + sweep });
    cursor += sweep;
  }
  const filledDegrees = Math.min(360, cursor);

  // The visible fill sweeps towards the real value, so adding food animates.
  const shown = useTween(filledDegrees, 900, 0);

  const c = size / 2;
  const rimR = size / 2 - 1;
  const wellR = size * 0.4;
  const outerR = size * 0.36;
  const innerR = size * 0.15;
  const gap = items.length > 1 ? 2.2 : 0;

  const t = tones[tone];

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* rim */}
        <Circle cx={c} cy={c} r={rimR} fill={t.rim} />
        {isFull ? (
          <Circle cx={c} cy={c} r={rimR - 1.5} fill="none" stroke={t.fullRing} strokeWidth={2.5} />
        ) : null}
        {/* well */}
        <Circle cx={c} cy={c} r={wellR} fill={t.well} stroke={t.wellEdge} strokeWidth={1} />
        {/* empty track */}
        <Path d={ringPath(c, outerR, innerR, 0, 359.99)} fill={t.track} />
        {/* food slices */}
        {slices.map((s, i) => {
          if (s.start >= shown) return null;
          const end = Math.min(s.end, shown);
          const a0 = s.start + gap / 2;
          const a1 = end - gap / 2;
          if (a1 - a0 < 0.4) return null;
          return (
            <Path
              key={s.id}
              d={ringPath(c, outerR, innerR, a0, a1)}
              fill={t.slice}
              fillOpacity={t.sliceOpacity[i % t.sliceOpacity.length]}
            />
          );
        })}
      </Svg>

      {/* emoji sit on top of their slice */}
      {showEmoji && size >= 140
        ? slices.map((s) => {
            const sweep = s.end - s.start;
            if (!s.emoji || sweep < 26 || s.end > shown + 1) return null;
            const mid = ((s.start + s.end) / 2) * (Math.PI / 180);
            const r = (outerR + innerR) / 2;
            const fontSize = Math.round(size * 0.075);
            return (
              <Text
                key={`e-${s.id}`}
                style={{
                  position: 'absolute',
                  left: c + r * Math.sin(mid) - fontSize * 0.65,
                  top: c - r * Math.cos(mid) - fontSize * 0.7,
                  fontSize,
                  lineHeight: fontSize * 1.3,
                  width: fontSize * 1.3,
                  textAlign: 'center',
                }}>
                {s.emoji}
              </Text>
            );
          })
        : null}

      {centerLabel && size >= 120 ? (
        <View style={[StyleSheet.absoluteFill, styles.center]} pointerEvents="none">
          <Text
            style={{
              fontFamily: fonts.displaySemi,
              fontSize: Math.round(size * 0.09),
              color: t.label,
              letterSpacing: -0.4,
            }}>
            {centerLabel}
          </Text>
          {centerCaption ? (
            <Text style={{ fontFamily: fonts.textSemi, fontSize: 9, letterSpacing: 1, color: t.caption }}>
              {centerCaption.toUpperCase()}
            </Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

/** Text for the middle of a plate: "62% full", "Full", or "+120 kcal over". */
export function plateCenter(kcal: number, target: number, hasItems: boolean) {
  if (!hasItems) return { centerLabel: 'Empty', centerCaption: undefined };
  const pct = Math.round((kcal / Math.max(target, 1)) * 100);
  if (pct <= 100) return { centerLabel: `${pct}%`, centerCaption: 'full' };
  return { centerLabel: `+${Math.round(kcal - target)}`, centerCaption: 'kcal over' };
}

const tones: Record<
  Tone,
  {
    rim: string;
    well: string;
    wellEdge: string;
    track: string;
    slice: string;
    sliceOpacity: number[];
    fullRing: string;
    label: string;
    caption: string;
  }
> = {
  onTomato: {
    rim: 'rgba(255,255,255,0.13)',
    well: 'rgba(255,255,255,0.07)',
    wellEdge: 'rgba(255,255,255,0.22)',
    track: 'rgba(255,255,255,0.08)',
    slice: '#FFFFFF',
    sliceOpacity: [0.96, 0.74, 0.86, 0.64],
    fullRing: '#FFFFFF',
    label: '#FFFFFF',
    caption: 'rgba(255,255,255,0.7)',
  },
  ceramic: {
    rim: '#FFFFFF',
    well: '#F8F6F2',
    wellEdge: 'rgba(20,20,20,0.07)',
    track: 'rgba(193,52,63,0.07)',
    slice: colors.tomato,
    sliceOpacity: [1, 0.72, 0.86, 0.58],
    fullRing: colors.tomato,
    label: colors.ink,
    caption: colors.inkSoft,
  },
};

/** Point on a circle, with 0° at 12 o'clock going clockwise. */
function polar(c: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: c + r * Math.sin(rad), y: c - r * Math.cos(rad) };
}

/** A slice of a ring between two radii and two angles. */
function ringPath(c: number, ro: number, ri: number, a0: number, a1: number): string {
  const sweep = Math.min(359.99, a1 - a0);
  const end = a0 + sweep;
  const large = sweep > 180 ? 1 : 0;
  const o0 = polar(c, ro, a0);
  const o1 = polar(c, ro, end);
  const i1 = polar(c, ri, end);
  const i0 = polar(c, ri, a0);
  return [
    `M ${o0.x} ${o0.y}`,
    `A ${ro} ${ro} 0 ${large} 1 ${o1.x} ${o1.y}`,
    `L ${i1.x} ${i1.y}`,
    `A ${ri} ${ri} 0 ${large} 0 ${i0.x} ${i0.y}`,
    'Z',
  ].join(' ');
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
