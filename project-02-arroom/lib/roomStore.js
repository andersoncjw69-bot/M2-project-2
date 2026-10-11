import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'm2.roomgallery.placements';
export const MAX_SAVED = 5;

// TODO 7: Remember the room between launches.
//
// Outcome: saveRecent(placements) stores the MOST RECENT MAX_SAVED entries of the array (the last ones) on the phone.
// loadRecent() resolves to the stored array, or [] when nothing is stored or the stored text is damaged.
// Each placement is a plain object { sculptureId, x, z, rotationY, scale }; keep it exactly as given.
// Verify:  save seven placements: loadRecent returns the last five, in order. Place three sculptures, close the app
// from the app switcher and reopen the room: all three are back where you left them.
// Reflect (in your Notes doc): which five do you keep when there are seven, and what would a user expect?
//
// Your code below ↓
export async function saveRecent(placements) {
  try {
    if (!Array.isArray(placements)) return;
    const recent = placements.slice(-MAX_SAVED);
    await AsyncStorage.setItem(KEY, JSON.stringify(recent));
  } catch (error) {
    // Fail safely
  }
}

export async function loadRecent() {
  try {
    const json = await AsyncStorage.getItem(KEY);
    if (!json) return [];
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(-MAX_SAVED);
  } catch (error) {
    return [];
  }
}
