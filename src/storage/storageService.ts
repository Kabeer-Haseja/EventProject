import AsyncStorage from '@react-native-async-storage/async-storage';
import {InterestedEvent} from '../types';

const STORAGE_KEYS = {
  INTERESTED_EVENTS: '@event_explorer:interested_events',
  THEME_PREFERENCE: '@event_explorer:theme',
} as const;

export const getInterestedEvents = async (): Promise<InterestedEvent[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.INTERESTED_EVENTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading interested events:', error);
    return [];
  }
};

export const addInterestedEvent = async (
  eventId: string,
): Promise<boolean> => {
  try {
    const interestedEvents = await getInterestedEvents();
    if (interestedEvents.some(e => e.eventId === eventId)) {
      return true;
    }

    const newEntry: InterestedEvent = {
      eventId,
      markedAt: new Date().toISOString(),
    };

    const updated = [...interestedEvents, newEntry];
    await AsyncStorage.setItem(
      STORAGE_KEYS.INTERESTED_EVENTS,
      JSON.stringify(updated),
    );

    return true;
  } catch (error) {
    console.error('Error adding interested event:', error);
    return false;
  }
};

export const removeInterestedEvent = async (
  eventId: string,
): Promise<boolean> => {
  try {
    const interestedEvents = await getInterestedEvents();
    const filtered = interestedEvents.filter(e => e.eventId !== eventId);

    await AsyncStorage.setItem(
      STORAGE_KEYS.INTERESTED_EVENTS,
      JSON.stringify(filtered),
    );

    return true;
  } catch (error) {
    console.error('Error removing interested event:', error);
    return false;
  }
};

export const getThemePreference = async (): Promise<'light' | 'dark' | null> => {
  try {
    const theme = await AsyncStorage.getItem(STORAGE_KEYS.THEME_PREFERENCE);
    return theme as 'light' | 'dark' | null;
  } catch (error) {
    console.error('Error reading theme preference:', error);
    return null;
  }
};


export const saveThemePreference = async (
  theme: 'light' | 'dark',
): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.THEME_PREFERENCE, theme);
    return true;
  } catch (error) {
    console.error('Error saving theme preference:', error);
    return false;
  }
};
