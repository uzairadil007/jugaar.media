import { View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

import { colors, radius } from '@/theme/tokens';

import { Text } from './Text';

/* ───────────── Sparkline (the little "THIS WEEK" area chart) ───────────── */

export function Sparkline({
  values,
  width,
  height,
  color = colors.ink,
  fill = colors.tomato,
  showLastDot = true,
}: {
  values: number[];
  width: number;
  height: number;
  color?: string;
  fill?: string;
  showLastDot?: boolean;
}) {
  if (values.length < 2) {
    return <View style={{ width, height }} />;
  }
  const pad = 4;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts = values.map((v, i) => ({
    x: pad + (i / (values.length - 1)) * (width - pad * 2),
    y: pad + (1 - (v - min) / span) * (height - pad * 2),
  }));
  const line = pts.map((p, i) => `${i ? 'L' : 'M'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const area = `${line} L ${pts[pts.length - 1].x} ${height} L ${pts[0].x} ${height} Z`;
  const last = pts[pts.length - 1];
  const id = `spark-${Math.round(width)}-${Math.round(height)}`;

  return (
    <Svg width={width} height={height}>
      <Defs>
        <LinearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={fill} stopOpacity={0.28} />
          <Stop offset="1" stopColor={fill} stopOpacity={0} />
        </LinearGradient>
      </Defs>
      <Path d={area} fill={`url(#${id})`} />
      <Path d={line} stroke={color} strokeWidth={1.6} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      {showLastDot ? <Circle cx={last.x} cy={last.y} r={3.5} fill={fill} stroke={colors.surface} strokeWidth={1.5} /> : null}
    </Svg>
  );
}

/* ───────────── Thin progress bar ───────────── */

export function ProgressBar({
  progress,
  color = colors.ink,
  track = colors.line,
  height = 6,
}: {
  progress: number;
  color?: string;
  track?: string;
  height?: number;
}) {
  const pct = `${Math.round(Math.max(0, Math.min(1, progress)) * 100)}%` as const;
  return (
    <View style={{ height, borderRadius: radius.pill, backgroundColor: track, overflow: 'hidden' }}>
      <View style={{ width: pct, height, borderRadius: radius.pill, backgroundColor: color }} />
    </View>
  );
}

/* ───────────── Weekly bars ───────────── */

export function WeekBars({
  bars,
  goal,
  height = 150,
  width,
}: {
  bars: { label: string; value: number; highlight?: boolean }[];
  goal?: number;
  height?: number;
  width: number;
}) {
  const max = Math.max(goal ?? 0, ...bars.map((b) => b.value), 1);
  const gap = 10;
  const barW = (width - gap * (bars.length - 1)) / bars.length;
  const goalY = goal ? height - (goal / max) * height : null;

  return (
    <View style={{ width }}>
      <Svg width={width} height={height}>
        {bars.map((b, i) => {
          const h = Math.max(4, (b.value / max) * height);
          return (
            <Rect
              key={i}
              x={i * (barW + gap)}
              y={height - h}
              width={barW}
              height={h}
              rx={Math.min(10, barW / 2)}
              fill={b.highlight ? colors.tomato : goal && b.value >= goal ? colors.ink : 'rgba(20,20,20,0.14)'}
            />
          );
        })}
        {goalY !== null ? (
          <Path d={`M 0 ${goalY} H ${width}`} stroke={colors.ink} strokeWidth={1} strokeDasharray="3 5" opacity={0.4} />
        ) : null}
      </Svg>
      <View style={{ flexDirection: 'row', gap, marginTop: 8 }}>
        {bars.map((b, i) => (
          <Text key={i} variant="label" align="center" style={{ width: barW }} color={b.highlight ? colors.tomato : undefined}>
            {b.label}
          </Text>
        ))}
      </View>
    </View>
  );
}
