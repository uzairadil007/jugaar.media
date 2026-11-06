import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/** Tiny wrapper so screens don't care whether the device can buzz. */
const enabled = Platform.OS === 'ios' || Platform.OS === 'android';

export const haptic = {
  tap: () => {
    if (enabled) void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  },
  select: () => {
    if (enabled) void Haptics.selectionAsync();
  },
  success: () => {
    if (enabled) void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  },
  warn: () => {
    if (enabled) void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  },
};
