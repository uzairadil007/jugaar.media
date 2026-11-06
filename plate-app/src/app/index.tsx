import { Redirect, router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { TodayCard } from '@/features/meals/components/TodayCard';
import { loggingStreak, useMealsStore } from '@/features/meals/store';
import { useProfileStore } from '@/features/profile/store';
import { StepsTile } from '@/features/steps/StepsTile';
import { LostTile } from '@/features/weight/LostTile';
import { greeting } from '@/lib/date';
import { colors, fonts, radius, space } from '@/theme/tokens';
import { Button, IconButton } from '@/ui/Buttons';
import { Icon } from '@/ui/Icon';
import { Row, Screen, Spacer } from '@/ui/Layout';
import { Text } from '@/ui/Text';

/**
 * Today. Exactly three numbers: calories eaten, steps taken, weight lost.
 * Everything else is one tap away.
 */
export default function TodayScreen() {
  const onboarded = useProfileStore((s) => s.onboarded);
  const name = useProfileStore((s) => s.name);
  const entries = useMealsStore((s) => s.entries);
  const streak = loggingStreak(entries);

  if (!onboarded) return <Redirect href="/onboarding" />;

  return (
    <Screen
      footer={
        <Row gap={space.sm}>
          <Button
            label="ADD FOOD"
            tone="outline"
            iconLeft="plus"
            style={styles.addButton}
            onPress={() => router.push('/add-food')}
          />
          <IconButton
            icon="camera"
            tone="ink"
            size={58}
            accessibilityLabel="Snap a meal"
            onPress={() => router.push({ pathname: '/add-food', params: { mode: 'snap' } })}
          />
        </Row>
      }>
      <Row justify="space-between">
        <IconButton icon="grid" accessibilityLabel="Plates" onPress={() => router.push('/meals')} />
        <IconButton icon="settings" accessibilityLabel="Settings" onPress={() => router.push('/settings')} />
      </Row>

      <Spacer size={space.xl} />

      <Row gap={space.md} align="center">
        <View style={styles.avatar}>
          <Text style={styles.avatarLetter}>{(name || 'P').slice(0, 1).toUpperCase()}</Text>
          <View style={styles.avatarDot} />
        </View>
        <View style={{ flex: 1 }}>
          <Text variant="body" color={colors.inkSoft}>
            {greeting()}
          </Text>
          <Text style={styles.name} numberOfLines={1}>
            {name || 'there'}
          </Text>
          <Row gap={6} style={{ marginTop: 2 }}>
            <Icon name="bolt" size={16} />
            <Text variant="label" color={colors.ink}>
              {streak > 0 ? `${streak}-day streak` : 'Log a meal to start a streak'}
            </Text>
          </Row>
        </View>
      </Row>

      <Spacer size={space.xl} />

      <TodayCard />

      <Spacer size={space.xs} />

      <Row gap={12} align="stretch">
        <StepsTile />
        <LostTile />
      </Row>
    </Screen>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 68,
    height: 68,
    borderRadius: radius.lg,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    fontFamily: fonts.displaySemi,
    fontSize: 30,
    color: colors.cream,
  },
  avatarDot: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.tomato,
    borderWidth: 3,
    borderColor: colors.cream,
  },
  name: {
    fontFamily: fonts.displaySemi,
    fontSize: 36,
    lineHeight: 40,
    letterSpacing: -0.8,
    color: colors.ink,
  },
  addButton: {
    flex: 1,
    height: 58,
  },
});
