import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/middleware';

/**
 * Every store persists on the device through this one adapter
 * (AsyncStorage on phones, localStorage on the web preview).
 * When the backend arrives, stores can keep this as an offline cache.
 */
export const deviceStorage = createJSONStorage(() => AsyncStorage);

/** Prefix for every key, so the app's data is easy to find and wipe. */
export const STORAGE_PREFIX = 'plate:';
