import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { colors } from '@/theme/tokens';

/**
 * One small line-icon set, drawn on a 24×24 grid with round caps,
 * so every icon in the app has the same weight.
 */
export type IconName =
  | 'arrow-left'
  | 'arrow-right'
  | 'arrow-down'
  | 'arrow-up'
  | 'chevron-left'
  | 'chevron-right'
  | 'plus'
  | 'minus'
  | 'check'
  | 'close'
  | 'grid'
  | 'settings'
  | 'camera'
  | 'image'
  | 'search'
  | 'bolt'
  | 'steps'
  | 'scale'
  | 'flame'
  | 'trash'
  | 'sync'
  | 'heart'
  | 'sparkle';

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
};

export function Icon({ name, size = 22, color = colors.ink, strokeWidth = 1.8 }: Props) {
  const p = {
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {name === 'arrow-left' && <Path d="M19 12H5M11 6l-6 6 6 6" {...p} />}
      {name === 'arrow-right' && <Path d="M5 12h14M13 6l6 6-6 6" {...p} />}
      {name === 'arrow-down' && <Path d="M12 5v14M6 13l6 6 6-6" {...p} />}
      {name === 'arrow-up' && <Path d="M12 19V5M6 11l6-6 6 6" {...p} />}
      {name === 'chevron-left' && <Path d="M15 5l-7 7 7 7" {...p} />}
      {name === 'chevron-right' && <Path d="M9 5l7 7-7 7" {...p} />}
      {name === 'plus' && <Path d="M12 5v14M5 12h14" {...p} />}
      {name === 'minus' && <Path d="M5 12h14" {...p} />}
      {name === 'check' && <Path d="M5 12.5l4.5 4.5L19 7.5" {...p} />}
      {name === 'close' && <Path d="M6 6l12 12M18 6L6 18" {...p} />}
      {name === 'grid' && (
        <>
          <Circle cx="8" cy="8" r="2.2" {...p} />
          <Circle cx="16" cy="8" r="2.2" {...p} />
          <Circle cx="8" cy="16" r="2.2" {...p} />
          <Circle cx="16" cy="16" r="2.2" {...p} />
        </>
      )}
      {name === 'settings' && (
        <>
          <Path d="M12 3l7.8 4.5v9L12 21l-7.8-4.5v-9z" {...p} />
          <Circle cx="12" cy="12" r="3" {...p} />
        </>
      )}
      {name === 'camera' && (
        <>
          <Path
            d="M4 8.5A2.5 2.5 0 0 1 6.5 6h1.6l1.4-2h5l1.4 2h1.6A2.5 2.5 0 0 1 20 8.5v8A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5z"
            {...p}
          />
          <Circle cx="12" cy="12.5" r="3.4" {...p} />
        </>
      )}
      {name === 'image' && (
        <>
          <Rect x="4" y="5" width="16" height="14" rx="2.5" {...p} />
          <Circle cx="9" cy="10" r="1.6" {...p} />
          <Path d="M5 17l4.5-4.5L13 16l2.5-2.5L20 18" {...p} />
        </>
      )}
      {name === 'search' && (
        <>
          <Circle cx="11" cy="11" r="6" {...p} />
          <Path d="M20 20l-4.5-4.5" {...p} />
        </>
      )}
      {name === 'bolt' && <Path d="M13 3L5 13.5h6L10 21l8-10.5h-6z" {...p} />}
      {name === 'steps' && (
        <>
          <Path d="M7.5 3.5c1.8 0 2.8 1.9 2.8 4.3 0 2-.7 3.2-.7 4.7H6c0-1.5-1.3-2.6-1.3-4.7 0-2.4 1-4.3 2.8-4.3z" {...p} />
          <Path d="M6.2 15.5h3.4v1.3a1.7 1.7 0 0 1-3.4 0z" {...p} />
          <Path d="M16.5 7.5c1.8 0 2.8 1.9 2.8 4.3 0 2-1.3 3.2-1.3 4.7h-3.6c0-1.5-.7-2.7-.7-4.7 0-2.4 1-4.3 2.8-4.3z" {...p} />
          <Path d="M14.4 19.5h3.4v.8a1.7 1.7 0 0 1-3.4 0z" {...p} />
        </>
      )}
      {name === 'scale' && (
        <>
          <Rect x="3.5" y="3.5" width="17" height="17" rx="4" {...p} />
          <Path d="M8 9a5.5 5.5 0 0 1 8 0M12 9.5l1.4-2" {...p} />
        </>
      )}
      {name === 'flame' && (
        <Path
          d="M12 21c3.6 0 6-2.4 6-5.8 0-3.8-3-5.7-3.6-9.2-1.8 1.2-3 3-3.2 5-1-.6-1.7-1.7-1.9-2.8C7.4 9.8 6 12.2 6 15.2 6 18.6 8.4 21 12 21z"
          {...p}
        />
      )}
      {name === 'trash' && (
        <Path d="M5 7h14M10 7V5h4v2M7 7l.8 12h8.4L17 7M10.5 11v5M13.5 11v5" {...p} />
      )}
      {name === 'sync' && (
        <Path d="M19 8a7.5 7.5 0 0 0-13.4 1M5 16a7.5 7.5 0 0 0 13.4-1M19 4v4h-4M5 20v-4h4" {...p} />
      )}
      {name === 'heart' && (
        <Path
          d="M12 20s-7.5-4.4-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.6-7.5 10-7.5 10z"
          {...p}
        />
      )}
      {name === 'sparkle' && (
        <Path d="M12 3l1.9 5.6L19.5 10.5 13.9 12.4 12 18l-1.9-5.6L4.5 10.5l5.6-1.9zM18.5 16.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z" {...p} />
      )}
    </Svg>
  );
}
