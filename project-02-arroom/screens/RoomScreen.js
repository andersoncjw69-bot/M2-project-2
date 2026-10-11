import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CameraView } from 'expo-camera';
import { GLView } from 'expo-gl';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as THREE from 'three';
import CameraGate from '../components/CameraGate';
import { setupScene } from '../lib/setupScene';
import { makeReticle } from '../lib/reticle';
import { floorPoint } from '../lib/floor';
import { sculptureModels } from '../lib/modelCache';
import { placeSculpture } from '../lib/placement';
import { nextRotation, nextScale } from '../lib/transform';
import { loadRecent, saveRecent } from '../lib/roomStore';
import { captureAndShare } from '../lib/share';
import { findSculpture, shareCaption, sizeText } from '../lib/catalogue';

// Provided: the room. A live camera feed with a transparent 3D scene on top.
//   place mode : drag a finger to slide the reticle over the floor; tap to place the chosen sculpture there.
//   select mode: tap a placed sculpture to select it; drag to move it, pinch to resize, twist to turn.
// Your TODOs plug into this file from lib/ (floor, model cache, placement, transform, store, share).
export default function RoomScreen({ sculpture, onBack }) {
  const sceneRef = useRef(null); // { scene, camera, floor, reticle, placed: [Group], outline, stop }
  const sizeRef = useRef({ width: 1, height: 1 });
  const shotRef = useRef(null); // the view that holds camera + 3D, for the screenshot
  const selectedRef = useRef(null);
  const startRef = useRef({ scale: 1, rotation: 0 });
  const modeRef = useRef('place');
  const [mode, setMode] = useState('place');
  const [selectedName, setSelectedName] = useState(null);
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState(null);

  useEffect(() => () => sceneRef.current && sceneRef.current.stop(), []);
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  // Provided: write the placed sculptures to the phone (the store keeps the most recent five).
  const persist = () => {
    const parts = sceneRef.current;
    saveRecent(
      parts.placed.map((group) => ({
        sculptureId: group.userData.sculptureId,
        x: group.position.x,
        z: group.position.z,
        rotationY: group.rotation.y,
        scale: group.scale.x,
      }))
    ).catch(() => {});
  };

  const addPlaced = (group) => {
    const parts = sceneRef.current;
    parts.scene.add(group);
    parts.placed.push(group);
    setCount(parts.placed.length);
  };

  // Provided: build the scene once, then bring back whatever was saved last time.
  const onContextCreate = (gl) => {
    const parts = setupScene(gl);
    const reticle = makeReticle();
    reticle.visible = false;
    parts.scene.add(reticle);
    sceneRef.current = { ...parts, reticle, placed: [], outline: null };

    (async () => {
      const records = await loadRecent();
      for (const record of records) {
        const saved = findSculpture(record.sculptureId);
        if (!saved) continue;
        const group = placeSculpture(await sculptureModels.get(saved.model), saved, { x: record.x, z: record.z });
        group.rotation.y = record.rotationY || 0;
        group.scale.setScalar(record.scale || 1);
        addPlaced(group);
      }
    })().catch((error) => setMessage(`Could not restore your room: ${error.message}`));
  };

  const touchPoint = (x, y) => {
    const parts = sceneRef.current;
    return parts ? floorPoint({ x, y }, sizeRef.current, parts.camera, parts.floor) : null;
  };

  const moveReticle = (point) => {
    const { reticle } = sceneRef.current;
    reticle.position.set(point.x, 0.01, point.z);
    reticle.visible = true;
  };

  const placeAtReticle = async () => {
    const parts = sceneRef.current;
    const original = await sculptureModels.get(sculpture.model);
    addPlaced(placeSculpture(original, sculpture, parts.reticle.position));
    persist();
  };

  // Provided (from Activity 08): the ray from a tap hits part of a model, so climb to the whole placed sculpture.
  const selectAt = (x, y) => {
    const parts = sceneRef.current;
    if (parts.outline) {
      parts.scene.remove(parts.outline);
      parts.outline = null;
    }
    const { width, height } = sizeRef.current;
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2((x / width) * 2 - 1, -(y / height) * 2 + 1), parts.camera);
    const hits = raycaster.intersectObjects(parts.placed, true);
    if (hits.length === 0) {
      selectedRef.current = null;
      setSelectedName(null);
      return;
    }
    let root = hits[0].object;
    while (root.parent && !root.userData.isPlaced) root = root.parent;
    selectedRef.current = root;
    parts.outline = new THREE.BoxHelper(root, 0xffd54f);
    parts.scene.add(parts.outline);
    setSelectedName(findSculpture(root.userData.sculptureId).name);
  };

  const refreshOutline = () => sceneRef.current.outline && sceneRef.current.outline.update();

  const onTap = (x, y) => {
    if (!sceneRef.current) return;
    if (modeRef.current === 'select') return selectAt(x, y);
    const point = touchPoint(x, y);
    if (!point) return;
    moveReticle(point); // the tap lands the reticle first, then the sculpture goes where the reticle is
    placeAtReticle().catch((error) => setMessage(`Could not place it: ${error.message}`));
  };

  const onDrag = (x, y) => {
    if (!sceneRef.current) return;
    const point = touchPoint(x, y);
    if (!point) return;
    if (modeRef.current === 'place') moveReticle(point);
    else if (selectedRef.current) {
      selectedRef.current.position.set(point.x, 0, point.z); // slides along the floor, never up or down
      refreshOutline();
    }
  };

  const tap = Gesture.Tap().runOnJS(true).onEnd((event, success) => success && onTap(event.x, event.y));
  const pan = Gesture.Pan().runOnJS(true).maxPointers(1).minDistance(6).onUpdate((event) => onDrag(event.x, event.y)).onEnd(() => selectedRef.current && persist());
  const pinch = Gesture.Pinch()
    .runOnJS(true)
    .enabled(mode === 'select')
    .onBegin(() => {
      if (selectedRef.current) startRef.current.scale = selectedRef.current.scale.x;
    })
    .onUpdate((event) => {
      if (!selectedRef.current) return;
      selectedRef.current.scale.setScalar(nextScale(startRef.current.scale, event.scale));
      refreshOutline();
    })
    .onEnd(() => selectedRef.current && persist());
  const twist = Gesture.Rotation()
    .runOnJS(true)
    .enabled(mode === 'select')
    .onBegin(() => {
      if (selectedRef.current) startRef.current.rotation = selectedRef.current.rotation.y;
    })
    .onUpdate((event) => {
      if (!selectedRef.current) return;
      selectedRef.current.rotation.y = nextRotation(startRef.current.rotation, event.rotation);
      refreshOutline();
    })
    .onEnd(() => selectedRef.current && persist());
  const gestures = Gesture.Simultaneous(tap, pan, pinch, twist);

  const onShare = async () => {
    const result = await captureAndShare(shotRef, shareCaption(sculpture));
    setMessage(result.shared ? 'Shared. Nice room!' : `Not shared: ${result.reason}`);
  };

  return (
    <CameraGate>
      <GestureDetector gesture={gestures}>
        <View ref={shotRef} collapsable={false} style={StyleSheet.absoluteFill} onLayout={(e) => (sizeRef.current = e.nativeEvent.layout)}>
          <CameraView style={StyleSheet.absoluteFill} facing="back" />
          <GLView style={StyleSheet.absoluteFill} onContextCreate={onContextCreate} />
        </View>
      </GestureDetector>

      <View style={styles.toolbar}>
        <Pressable style={styles.back} onPress={onBack}>
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        {['place', 'select'].map((m) => (
          <Pressable key={m} onPress={() => setMode(m)} style={[styles.toggle, mode === m && styles.toggleActive]}>
            <Text style={[styles.toggleText, mode === m && styles.toggleTextActive]}>{m}</Text>
          </Pressable>
        ))}
        <Pressable style={styles.share} onPress={onShare}>
          <Text style={styles.shareText}>Share</Text>
        </Pressable>
      </View>

      <View style={styles.hud} pointerEvents="none">
        <Text style={styles.hudText}>
          {mode === 'place'
            ? `${sculpture.name} (${sizeText(sculpture)}): drag to aim, tap to place. ${count} in room`
            : selectedName
            ? `${selectedName}: drag to move, pinch to resize, twist to turn`
            : 'Tap a sculpture to select it'}
        </Text>
        {message ? <Text style={styles.hudText}>{message}</Text> : null}
      </View>
    </CameraGate>
  );
}

const styles = StyleSheet.create({
  toolbar: { position: 'absolute', top: 52, left: 12, right: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  back: { backgroundColor: 'rgba(0,0,0,0.55)', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 18 },
  backText: { color: '#fff', fontSize: 16 },
  toggle: { backgroundColor: 'rgba(0,0,0,0.55)', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 18 },
  toggleActive: { backgroundColor: '#fff' },
  toggleText: { color: '#fff', fontSize: 16, textTransform: 'capitalize' },
  toggleTextActive: { color: '#111', fontWeight: '600' },
  share: { backgroundColor: '#188038', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 18 },
  shareText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  hud: { position: 'absolute', bottom: 56, left: 16, right: 16, alignItems: 'center' },
  hudText: { color: '#fff', backgroundColor: 'rgba(0,0,0,0.55)', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 16, fontSize: 15, marginTop: 6, textAlign: 'center', overflow: 'hidden' },
});
