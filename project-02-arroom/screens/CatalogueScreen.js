import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SCULPTURES, sizeText } from '../lib/catalogue';

// Props: onChoose(sculpture), called when the visitor picks a piece to place.
export default function CatalogueScreen({ onChoose }) {
// TODO 1: Show the sculptures as a catalogue.
//
// Outcome: every entry in SCULPTURES appears as a card with a thumbnail tile (a square in the sculpture's tint with its
// first letter is enough, or your own picture), its name, and its real-world size (sizeText gives the line).
// Tapping a card calls onChoose with that sculpture. The list scrolls and shows all 5 on a small phone.
// Verify:  five cards in a column, each with a different tint, name and size. Tap "Stone Wave": the room opens for it.
// Reflect (in your Notes doc): why does a buyer need the real size on the card before they ever see the 3D view?
//
  return (
    <View style={styles.container}>
      <Text style={styles.title}>RoomGallery</Text>
      <Text style={styles.subtitle}>Pick a sculpture, then place it in your room.</Text>
      <FlatList
        data={SCULPTURES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => onChoose(item)}>
            <View style={[styles.thumb, { backgroundColor: item.tint }]}>
              <Text style={styles.thumbLetter}>{item.name.charAt(0)}</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.size}>{sizeText(item)}</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 56 },
  title: { fontSize: 26, fontWeight: '700', paddingHorizontal: 20 },
  subtitle: { color: '#5f6368', paddingHorizontal: 20, marginBottom: 12 },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f3f4', borderRadius: 14, padding: 12, marginBottom: 12 },
  thumb: { width: 64, height: 64, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  thumbLetter: { color: '#fff', fontSize: 28, fontWeight: '700' },
  info: { marginLeft: 14, flex: 1 },
  name: { fontSize: 18, fontWeight: '600' },
  size: { color: '#5f6368', marginTop: 4 },
});
