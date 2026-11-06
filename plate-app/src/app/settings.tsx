import { router } from 'expo-router';
import { Alert, Platform, StyleSheet, View } from 'react-native';

import { resetAllData, seedDemoData } from '@/features/app';
import { SLOTS, slotTarget } from '@/features/meals/slots';
import { useProfileStore } from '@/features/profile/store';
import { useStepsStore } from '@/features/steps/store';
import { formatNumber, formatWeight, kgToUnit, unitToKg, type WeightUnit } from '@/lib/format';
import { healthProvider } from '@/services/health';
import { colors, fonts, radius, space } from '@/theme/tokens';
import { Button, Chip, IconButton, Stepper } from '@/ui/Buttons';
import { Icon } from '@/ui/Icon';
import { Field, Row, Screen, Spacer } from '@/ui/Layout';
import { Text } from '@/ui/Text';

export default function SettingsScreen() {
  const profile = useProfileStore();
  const connected = useStepsStore((s) => s.connected);
  const { unit } = profile;

  const nudgeWeight = (key: 'startWeightKg' | 'goalWeightKg', delta: number) => {
    const shown = Math.round((kgToUnit(profile[key], unit) + delta) * 10) / 10;
    profile.update({ [key]: unitToKg(shown, unit) });
  };

  const confirm = (title: string, message: string, action: () => void) => {
    if (Platform.OS === 'web') {
      if (globalThis.confirm?.(`${title}\n\n${message}`) ?? true) action();
      return;
    }
    Alert.alert(title, message, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Continue', style: 'destructive', onPress: action },
    ]);
  };

  return (
    <Screen>
      <Row justify="space-between">
        <IconButton icon="arrow-left" accessibilityLabel="Back" onPress={() => router.back()} />
      </Row>
      <Spacer size={space.xl} />
      <Text variant="title">Settings</Text>

      <Section title="You">
        <Field label="Name" value={profile.name} onChangeText={(name) => profile.update({ name })} placeholder="Your name" />
        <Row justify="space-between" style={styles.row}>
          <Text variant="bodyStrong">Units</Text>
          <Row gap={6}>
            {(['kg', 'lb'] as WeightUnit[]).map((u) => (
              <Chip key={u} label={u} selected={unit === u} onPress={() => profile.update({ unit: u })} />
            ))}
          </Row>
        </Row>
      </Section>

      <Section title="Goals">
        <Setting label="Calories a day">
          <Stepper
            onDecrement={() => profile.update({ calorieGoal: Math.max(1000, profile.calorieGoal - 50) })}
            onIncrement={() => profile.update({ calorieGoal: Math.min(5000, profile.calorieGoal + 50) })}>
            <Text style={styles.value}>{formatNumber(profile.calorieGoal)}</Text>
          </Stepper>
          <Text variant="caption" style={{ marginTop: space.xs }}>
            {SLOTS.map((s) => `${s.label} ${formatNumber(slotTarget(s.id, profile.calorieGoal))}`).join(' · ')}
          </Text>
        </Setting>
        <Setting label="Steps a day">
          <Stepper
            onDecrement={() => profile.update({ stepGoal: Math.max(1000, profile.stepGoal - 500) })}
            onIncrement={() => profile.update({ stepGoal: Math.min(40000, profile.stepGoal + 500) })}>
            <Text style={styles.value}>{formatNumber(profile.stepGoal)}</Text>
          </Stepper>
        </Setting>
        <Setting label={`Starting weight (${unit})`}>
          <Stepper onDecrement={() => nudgeWeight('startWeightKg', -0.5)} onIncrement={() => nudgeWeight('startWeightKg', 0.5)}>
            <Text style={styles.value}>{formatWeight(profile.startWeightKg, unit)}</Text>
          </Stepper>
        </Setting>
        <Setting label={`Goal weight (${unit})`}>
          <Stepper onDecrement={() => nudgeWeight('goalWeightKg', -0.5)} onIncrement={() => nudgeWeight('goalWeightKg', 0.5)}>
            <Text style={styles.value}>{formatWeight(profile.goalWeightKg, unit)}</Text>
          </Stepper>
        </Setting>
      </Section>

      <Section title="Steps">
        <Row justify="space-between" style={styles.linkRow}>
          <Row gap={space.sm}>
            <View style={styles.dot}>
              <Icon name="heart" size={18} color={connected ? colors.tomato : colors.inkSoft} />
            </View>
            <View>
              <Text variant="bodyStrong">{healthProvider.label}</Text>
              <Text variant="caption">{connected ? 'Syncing' : 'Not connected'}</Text>
            </View>
          </Row>
          <IconButton icon="chevron-right" tone="white" size={40} accessibilityLabel="Open steps" onPress={() => router.push('/steps')} />
        </Row>
      </Section>

      <Section title="Data">
        <Text variant="caption">Everything is stored on this phone until the backend is connected.</Text>
        <Spacer size={space.xs} />
        <Button
          label="Load a demo week"
          tone="outline"
          iconLeft="sparkle"
          onPress={() =>
            confirm('Load demo week?', 'This replaces your meals and weigh-ins with sample data.', () => {
              seedDemoData();
              router.replace('/');
            })
          }
        />
        <Button
          label="Erase everything"
          tone="tomato"
          iconLeft="trash"
          onPress={() =>
            confirm('Erase everything?', 'Meals, weigh-ins and goals on this phone will be deleted.', () => {
              resetAllData();
              router.replace('/onboarding');
            })
          }
        />
      </Section>
    </Screen>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginTop: space.xl, gap: space.sm }}>
      <Text variant="label">{title}</Text>
      {children}
    </View>
  );
}

function Setting({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.setting}>
      <Text variant="bodyStrong" style={{ marginBottom: space.xs }}>
        {label}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
  },
  setting: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: space.md,
  },
  value: {
    fontFamily: fonts.displayMedium,
    fontSize: 24,
    color: colors.ink,
  },
  linkRow: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: space.md,
  },
  dot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
