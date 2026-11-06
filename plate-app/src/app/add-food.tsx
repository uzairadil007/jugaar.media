import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from 'react-native';

import type { Food } from '@/features/foods/catalog';
import { recognizeMeal, type Recognition } from '@/features/foods/recognize';
import { searchLocalFoods } from '@/features/foods/search';
import { FoodRow } from '@/features/meals/components/FoodRow';
import { Plate } from '@/features/meals/components/Plate';
import { isMealSlot, slotForTime, slotInfo, SLOTS, slotTarget } from '@/features/meals/slots';
import { entriesForSlot, recentFoods, useMealsStore } from '@/features/meals/store';
import type { MealSlot, NewFoodEntry } from '@/features/meals/types';
import { useProfileStore } from '@/features/profile/store';
import { addMinutes, dayKey, formatTime, fromDayKey, isToday, relativeDay, withTimeOnDay } from '@/lib/date';
import { formatNumber } from '@/lib/format';
import { haptic } from '@/lib/haptics';
import { colors, fonts, radius, space } from '@/theme/tokens';
import { Button, Chip, IconButton } from '@/ui/Buttons';
import { Icon } from '@/ui/Icon';
import { Field, Row, Screen, Spacer } from '@/ui/Layout';
import { Text } from '@/ui/Text';

type Mode = 'search' | 'quick' | 'snap';

/**
 * Add food: what you ate (search, quick add or a photo), and when.
 * The plate at the top fills up live as things are added.
 */
export default function AddFoodScreen() {
  const params = useLocalSearchParams<{ slot?: string; day?: string; mode?: string }>();
  const day = params.day ?? dayKey();

  const [mode, setMode] = useState<Mode>(
    params.mode === 'snap' || params.mode === 'quick' ? params.mode : 'search',
  );
  // "When": defaults to now (or midday for a past day), adjustable in 15 min steps.
  const [time, setTime] = useState(() => (isToday(day) ? new Date() : withTimeOnDay(fromDayKey(day), new Date(0, 0, 0, 13))));
  const [slotOverride, setSlotOverride] = useState<MealSlot | null>(isMealSlot(params.slot) ? params.slot : null);
  const slot = slotOverride ?? slotForTime(time);

  const entries = useMealsStore((s) => s.entries);
  const add = useMealsStore((s) => s.add);
  const goal = useProfileStore((s) => s.calorieGoal);
  const onPlate = entriesForSlot(entries, day, slot);
  const plateKcal = onPlate.reduce((s, e) => s + e.kcal, 0);
  const target = slotTarget(slot, goal);

  const eatenAt = withTimeOnDay(fromDayKey(day), time);
  const log = (entry: Omit<NewFoodEntry, 'slot' | 'eatenAt'>) => {
    add({ ...entry, slot, eatenAt: eatenAt.toISOString() });
    haptic.success();
  };

  const nudgeTime = (minutes: number) => {
    const next = addMinutes(time, minutes);
    if (isToday(day) && next > new Date()) return;
    haptic.select();
    setTime(next);
  };

  return (
    <Screen padded>
      {/* header: live plate + close */}
      <Row justify="space-between" align="center">
        <Row gap={space.sm}>
          <View style={styles.miniPlate}>
            <Plate items={onPlate} target={target} size={64} tone="ceramic" showEmoji={false} />
          </View>
          <View>
            <Text variant="label">Adding to</Text>
            <Text variant="heading">{slotInfo(slot).label}</Text>
            <Text variant="caption">
              {formatNumber(plateKcal)} / {formatNumber(target)} kcal
            </Text>
          </View>
        </Row>
        <IconButton icon="close" accessibilityLabel="Close" onPress={() => router.back()} />
      </Row>

      <Spacer size={space.lg} />

      {/* when */}
      <View style={styles.when}>
        <Row justify="space-between">
          <View>
            <Text variant="label">When</Text>
            <Text style={styles.time}>{formatTime(time)}</Text>
            <Text variant="caption">{relativeDay(day)}</Text>
          </View>
          <Row gap={8}>
            <IconButton icon="minus" size={40} accessibilityLabel="15 minutes earlier" onPress={() => nudgeTime(-15)} />
            <IconButton icon="plus" size={40} accessibilityLabel="15 minutes later" onPress={() => nudgeTime(15)} />
            {isToday(day) ? (
              <Chip label="Now" onPress={() => setTime(new Date())} />
            ) : null}
          </Row>
        </Row>
        <Spacer size={space.sm} />
        <Row gap={6}>
          {SLOTS.map((s) => (
            <Chip key={s.id} grow label={s.label} selected={s.id === slot} onPress={() => setSlotOverride(s.id)} />
          ))}
        </Row>
      </View>

      <Spacer size={space.lg} />

      {/* what */}
      <View style={styles.tabs}>
        {(['search', 'quick', 'snap'] as const).map((m) => (
          <Pressable
            key={m}
            accessibilityRole="tab"
            accessibilityState={{ selected: mode === m }}
            onPress={() => {
              haptic.select();
              setMode(m);
            }}
            style={[styles.tab, mode === m && styles.tabActive]}>
            <Icon name={m === 'search' ? 'search' : m === 'quick' ? 'flame' : 'camera'} size={16} color={mode === m ? colors.cream : colors.inkSoft} />
            <Text style={[styles.tabText, mode === m && { color: colors.cream }]}>
              {m === 'search' ? 'Search' : m === 'quick' ? 'Quick add' : 'Snap'}
            </Text>
          </Pressable>
        ))}
      </View>

      <Spacer size={space.md} />

      {mode === 'search' ? <SearchPanel onAdd={log} /> : null}
      {mode === 'quick' ? <QuickAddPanel onAdd={log} /> : null}
      {mode === 'snap' ? <SnapPanel onAdd={log} /> : null}
    </Screen>
  );
}

type LogFn = (entry: Omit<NewFoodEntry, 'slot' | 'eatenAt'>) => void;

function fromFood(food: Food, servings = 1, source: NewFoodEntry['source'] = 'search') {
  return {
    foodId: food.id,
    name: food.name,
    emoji: food.emoji,
    kcal: Math.round(food.kcal * servings),
    protein: Math.round(food.protein * servings),
    carbs: Math.round(food.carbs * servings),
    fat: Math.round(food.fat * servings),
    portion: servings === 1 ? food.portion : `${servings} × ${food.portion}`,
    source,
  };
}

/* ───────────── Search ───────────── */

function SearchPanel({ onAdd }: { onAdd: LogFn }) {
  const [query, setQuery] = useState('');
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const entries = useMealsStore((s) => s.entries);
  const results = searchLocalFoods(query, 25);
  const recents = query ? [] : recentFoods(entries, 4);

  const addFood = (food: Food) => {
    onAdd(fromFood(food));
    setJustAdded(food.id);
    setTimeout(() => setJustAdded((id) => (id === food.id ? null : id)), 1200);
  };

  return (
    <View>
      <View style={styles.search}>
        <Icon name="search" size={18} color={colors.inkSoft} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search foods — roti, oats, biryani…"
          placeholderTextColor={colors.inkFaint}
          style={styles.searchInput}
          autoCorrect={false}
          returnKeyType="search"
        />
        {query ? (
          <Pressable hitSlop={10} onPress={() => setQuery('')} accessibilityLabel="Clear search">
            <Icon name="close" size={16} color={colors.inkSoft} />
          </Pressable>
        ) : null}
      </View>

      {recents.length ? (
        <>
          <Spacer size={space.md} />
          <Text variant="label">Recent</Text>
          {recents.map((r) => (
            <FoodRow
              key={`recent-${r.id}`}
              emoji={r.emoji}
              name={r.name}
              detail={r.portion}
              kcal={r.kcal}
              action={justAdded === r.id ? 'check' : 'plus'}
              actionTone={justAdded === r.id ? 'tomato' : 'ink'}
              actionLabel={`Add ${r.name}`}
              onAction={() => {
                const { id: _id, slot: _slot, eatenAt: _at, ...rest } = r;
                onAdd({ ...rest, source: 'search' });
                setJustAdded(r.id);
                setTimeout(() => setJustAdded((id) => (id === r.id ? null : id)), 1200);
              }}
            />
          ))}
        </>
      ) : null}

      <Spacer size={space.md} />
      <Text variant="label">{query ? `${results.length} results` : 'Popular'}</Text>
      {results.map((food) => (
        <FoodRow
          key={food.id}
          emoji={food.emoji}
          name={food.name}
          detail={`${food.portion} · P ${food.protein}g`}
          kcal={food.kcal}
          action={justAdded === food.id ? 'check' : 'plus'}
          actionTone={justAdded === food.id ? 'tomato' : 'ink'}
          actionLabel={`Add ${food.name}`}
          onAction={() => addFood(food)}
          onPress={() => addFood(food)}
        />
      ))}
      {query && results.length === 0 ? (
        <Text variant="body" color={colors.inkSoft} style={{ marginTop: space.sm }}>
          Nothing found. Use Quick add to enter it yourself.
        </Text>
      ) : null}
    </View>
  );
}

/* ───────────── Quick add ───────────── */

function QuickAddPanel({ onAdd }: { onAdd: LogFn }) {
  const [name, setName] = useState('');
  const [kcal, setKcal] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const kcalNum = Number(kcal);
  const valid = name.trim().length > 0 && kcalNum > 0;
  const num = (v: string) => Math.max(0, Number(v) || 0);

  return (
    <View style={{ gap: space.sm }}>
      <Field label="What was it" value={name} onChangeText={setName} placeholder="Homemade pulao" />
      <Field label="Calories" value={kcal} onChangeText={setKcal} placeholder="450" keyboardType="number-pad" suffix="kcal" />
      <Row gap={space.sm}>
        <Field style={{ flex: 1 }} label="Protein" value={protein} onChangeText={setProtein} placeholder="0" keyboardType="number-pad" suffix="g" />
        <Field style={{ flex: 1 }} label="Carbs" value={carbs} onChangeText={setCarbs} placeholder="0" keyboardType="number-pad" suffix="g" />
        <Field style={{ flex: 1 }} label="Fat" value={fat} onChangeText={setFat} placeholder="0" keyboardType="number-pad" suffix="g" />
      </Row>
      <Spacer size={space.xs} />
      <Button
        label="Add to plate"
        iconRight="check"
        disabled={!valid}
        onPress={() => {
          onAdd({
            name: name.trim(),
            emoji: '🍽️',
            kcal: Math.round(kcalNum),
            protein: num(protein),
            carbs: num(carbs),
            fat: num(fat),
            portion: '1 serving',
            source: 'quick',
          });
          setName('');
          setKcal('');
          setProtein('');
          setCarbs('');
          setFat('');
        }}
      />
    </View>
  );
}

/* ───────────── Snap (photo → foods) ───────────── */

function SnapPanel({ onAdd }: { onAdd: LogFn }) {
  const [photo, setPhoto] = useState<string | null>(null);
  const [result, setResult] = useState<Recognition | null>(null);
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pick = async (from: 'camera' | 'library') => {
    setError(null);
    const permission =
      from === 'camera'
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError(from === 'camera' ? 'Camera access is off. Turn it on in Settings.' : 'Photo access is off. Turn it on in Settings.');
      return;
    }
    const options: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], quality: 0.7, allowsEditing: true, aspect: [1, 1] };
    const res = from === 'camera' ? await ImagePicker.launchCameraAsync(options) : await ImagePicker.launchImageLibraryAsync(options);
    if (res.canceled) return;
    const uri = res.assets[0].uri;
    setPhoto(uri);
    setResult(null);
    setBusy(true);
    try {
      const r = await recognizeMeal(uri);
      setResult(r);
      setPicked(new Set(r.items.map((i) => i.food.id)));
      haptic.success();
    } catch {
      setError('Could not read that photo. Try again or search instead.');
    } finally {
      setBusy(false);
    }
  };

  const addPicked = () => {
    if (!result) return;
    for (const item of result.items) {
      if (picked.has(item.food.id)) onAdd({ ...fromFood(item.food, item.servings, 'scan'), photoUri: photo ?? undefined });
    }
    setPhoto(null);
    setResult(null);
  };

  if (!photo) {
    return (
      <View style={{ gap: space.sm }}>
        <Pressable onPress={() => pick('camera')} style={({ pressed }) => [styles.snapBox, pressed && { opacity: 0.85 }]}>
          <View style={styles.snapIcon}>
            <Icon name="camera" size={30} color={colors.onTomato} />
          </View>
          <Text variant="heading" color={colors.onTomato}>
            Snap your plate
          </Text>
          <Text variant="caption" color={colors.onTomatoSoft} align="center">
            Take a photo and we&apos;ll work out what&apos;s on it and the calories.
          </Text>
        </Pressable>
        <Button label="Choose from photos" tone="outline" iconLeft="image" onPress={() => pick('library')} />
        {error ? <Text variant="caption" color={colors.tomato}>{error}</Text> : null}
      </View>
    );
  }

  return (
    <View style={{ gap: space.md }}>
      <View style={styles.photoWrap}>
        <Image source={{ uri: photo }} style={styles.photo} contentFit="cover" />
        {busy ? (
          <View style={styles.photoOverlay}>
            <ActivityIndicator color={colors.onTomato} />
            <Text variant="label" color={colors.onTomato}>
              Reading your plate…
            </Text>
          </View>
        ) : null}
      </View>

      {result ? (
        <View>
          <Row justify="space-between">
            <Text variant="label">Found on your plate</Text>
            {result.isDemo ? (
              <View style={styles.demoBadge}>
                <Icon name="sparkle" size={12} color={colors.tomato} />
                <Text style={styles.demoText}>Demo estimate</Text>
              </View>
            ) : null}
          </Row>
          {result.items.map((item) => {
            const on = picked.has(item.food.id);
            const kcal = Math.round(item.food.kcal * item.servings);
            return (
              <FoodRow
                key={item.food.id}
                emoji={item.food.emoji}
                name={item.food.name}
                detail={`${Math.round(item.confidence * 100)}% sure · ${item.servings === 1 ? item.food.portion : `${item.servings} × ${item.food.portion}`}`}
                kcal={kcal}
                action={on ? 'check' : 'plus'}
                actionTone={on ? 'tomato' : 'soft'}
                actionLabel={on ? `Leave out ${item.food.name}` : `Include ${item.food.name}`}
                onAction={() => {
                  haptic.select();
                  const next = new Set(picked);
                  if (on) next.delete(item.food.id);
                  else next.add(item.food.id);
                  setPicked(next);
                }}
              />
            );
          })}
          <Spacer size={space.sm} />
          <Button
            label={`Add ${picked.size} to plate`}
            iconRight="check"
            disabled={picked.size === 0}
            onPress={addPicked}
          />
          <Spacer size={space.xs} />
          <Button label="Retake" tone="outline" onPress={() => setPhoto(null)} />
        </View>
      ) : null}
      {error ? <Text variant="caption" color={colors.tomato}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  miniPlate: {
    width: 64,
    height: 64,
    borderRadius: 32,
    shadowColor: '#5A1018',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    backgroundColor: colors.surface,
  },
  when: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: space.md,
  },
  time: {
    fontFamily: fonts.displayLight,
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -1,
    color: colors.ink,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.chip,
    borderRadius: radius.pill,
    padding: 4,
  },
  tab: {
    flex: 1,
    height: 40,
    borderRadius: radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  tabActive: {
    backgroundColor: colors.ink,
  },
  tabText: {
    fontFamily: fonts.textSemi,
    fontSize: 13,
    color: colors.inkSoft,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingHorizontal: 18,
    height: 52,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.text,
    fontSize: 15,
    color: colors.ink,
    height: '100%',
    outlineWidth: 0,
  },
  snapBox: {
    backgroundColor: colors.tomato,
    borderRadius: radius.xl,
    padding: space.xl,
    alignItems: 'center',
    gap: space.xs,
    minHeight: 230,
    justifyContent: 'center',
  },
  snapIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.5)',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space.xs,
  },
  photoWrap: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    aspectRatio: 1,
    backgroundColor: colors.chip,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(193,52,63,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
  },
  demoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(193,52,63,0.1)',
  },
  demoText: {
    fontFamily: fonts.textSemi,
    fontSize: 11,
    color: colors.tomato,
  },
});
