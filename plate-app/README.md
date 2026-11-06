# plate.

A minimalist calorie counter. The home screen shows three things only:

1. **Calories eaten today**, drawn as a plate that fills up
2. **Steps today**, synced from Apple Health (iPhone) or Health Connect (Android)
3. **Weight lost** since day one

Meals live on red "plates" (Breakfast, Lunch, Dinner, Snacks). Every food you log, with the time you ate it, becomes a slice of the plate. When you reach that meal's share of your daily calories, the plate is full.

This is the **front end only**. Data is stored on the phone for now; every place the backend plugs in is marked below.

## Run it

```bash
npm install
npm run web          # quickest look, in the browser (demo step data)
npx expo start       # Expo Go works for everything except real step sync
```

Apple Health and Health Connect need native code, so real step sync needs a **development build** instead of Expo Go:

```bash
npx eas-cli@latest build --profile development --platform ios      # or android
npx expo start --dev-client
```

Or build locally with `npm run ios` / `npm run android` (needs Xcode / Android Studio).

Checks: `npm run typecheck`, `npm run lint`, `npx expo-doctor`.

## Screens

| Route | Screen |
| --- | --- |
| `/onboarding` | First launch: name, weight, goal weight, daily calories (or load a demo week) |
| `/` | Today: calories plate, steps tile, weight-lost tile, Add food / Snap |
| `/meals` | Swipeable red plate cards with meal chips, day switcher, macros |
| `/meals/[slot]` | One plate up close: red top, plate on the fold, what's on it |
| `/add-food` | When you ate it, plus Search, Quick add or Snap a photo. The plate fills live |
| `/steps` | Big step count, last 7 days, health-app connection |
| `/weight` | Weight lost, trend, log a weigh-in |
| `/settings` | Goals, units, health sync, demo data, erase |

## How the code is laid out

```
src/
  app/                 screens (Expo Router: one file per route)
  theme/tokens.ts      the 3 colours, 2 typefaces, spacing; restyle the app here
  ui/                  design-system pieces: Text, Buttons, NotchCard, Charts, Icon, Layout
  features/
    meals/             food log store, meal slots, Plate, MealCard, TodayCard, FoodRow
    foods/             food catalogue, search, photo recognition
    steps/             step store, health sync hook, StepsTile
    weight/            weigh-in store, LostTile
    profile/           goals and settings store
    app.ts             hydration, demo data, reset
  services/health/     one interface, three implementations:
    apple.ts           iOS: Apple Health (HealthKit)
    healthConnect.ts   Android: Health Connect (Google Fit, Samsung Health, Fitbit write here)
    demo.ts            web and Expo Go: clearly labelled demo numbers
  lib/                 dates, number formatting, haptics, storage, tween
```

Each feature owns its store, its selectors and its components. Screens only compose them.

## Design

- **Colours:** tomato `#C1343F` (plates, highlights), ink `#141414` (text, buttons), cream `#F5F2EC` (background). Everything else is a tint of these.
- **Type:** Outfit for numbers and headings (thin and big, like the "256 KCAL" reference), Inter for body text and small spaced labels.
- **Plate:** `features/meals/components/Plate.tsx` draws the plate in SVG. Slices are sized by calories against the meal's target and animate in when food is added.
- **Notch card:** `ui/NotchCard.tsx` is the red card with the round black button sitting in a cut-out on its bottom edge.

Change `theme/tokens.ts` to re-skin the whole app.

## Hooking up the backend

| What | Where | Today |
| --- | --- | --- |
| Food search | `features/foods/search.ts` → `searchFoods()` | ~50 built-in foods, including Pakistani staples |
| Snap a meal (photo → foods) | `features/foods/recognize.ts` → `recognizeMeal()` | Demo result, labelled "Demo estimate" in the UI |
| Food log | `features/meals/store.ts` (`add`, `remove`, `replaceAll`) | Saved on the device |
| Weigh-ins | `features/weight/store.ts` | Saved on the device; newer health-app weights are imported |
| Profile & goals | `features/profile/store.ts` | Saved on the device |

The stores are Zustand with on-device persistence. To move to a server, call your API inside those actions and keep the local copy as an offline cache.

## Health permissions

- **iOS:** reads Step Count and Body Mass. No write access, no background delivery. Usage text is set in `app.json`.
- **Android:** `READ_STEPS` and `READ_WEIGHT` from Health Connect, `minSdkVersion` 26. The Health Connect rationale screen is wired up by the library's config plugin.
