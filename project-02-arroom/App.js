import React, { useEffect, useState } from 'react';
import { BackHandler } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CatalogueScreen from './screens/CatalogueScreen';
import RoomScreen from './screens/RoomScreen';

// Polyfill check for Three.js r163+ with Expo WebGL2 contexts
if (typeof global !== 'undefined' && typeof global.WebGLRenderingContext !== 'undefined') {
  try {
    Object.defineProperty(global.WebGLRenderingContext, Symbol.hasInstance, {
      value: () => false,
      configurable: true,
    });
  } catch (e) {}
}

// Provided: two screens, no navigation library. The catalogue picks a sculpture; the room places it.
// The Android back button goes from the room back to the catalogue.
export default function App() {
  const [sculpture, setSculpture] = useState(null);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!sculpture) return false;
      setSculpture(null);
      return true;
    });
    return () => subscription.remove();
  }, [sculpture]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {sculpture ? <RoomScreen sculpture={sculpture} onBack={() => setSculpture(null)} /> : <CatalogueScreen onChoose={setSculpture} />}
    </GestureHandlerRootView>
  );
}
