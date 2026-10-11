import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useCameraPermissions } from 'expo-camera';

// Provided (from Activity 06): shows its children only once the camera is allowed.
export default function CameraGate({ children }) {
  const [permission, requestPermission] = useCameraPermissions();
  if (!permission) return <View style={styles.center} />;
  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Camera needed</Text>
        <Text style={styles.body}>The camera feed is the backdrop for your 3D room. Nothing is recorded or saved.</Text>
        <Pressable style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Allow camera</Text>
        </Pressable>
      </View>
    );
  }
  return children;
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  body: { fontSize: 16, color: '#444', textAlign: 'center', marginBottom: 16 },
  button: { backgroundColor: '#188038', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
