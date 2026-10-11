// Provided: five sculptures. They all use the one sculpture.glb (a 0.4 x 0.6 x 0.4 m block in its own
// units); each entry says how big the real piece is, in metres. `tint` colours the catalogue tile.
// Swap in a .glb you have the right to use if you like: keep it in assets/ and point `model` at it.
const MODEL = require('../assets/sculpture.glb');

export const SCULPTURES = [
  { id: 'tide-pillar', name: 'Tide Pillar', heightM: 1.8, widthM: 0.4, depthM: 0.4, tint: '#0d9488', model: MODEL },
  { id: 'bronze-heron', name: 'Bronze Heron', heightM: 1.2, widthM: 0.5, depthM: 0.4, tint: '#b45309', model: MODEL },
  { id: 'lantern-cube', name: 'Lantern Cube', heightM: 0.6, widthM: 0.6, depthM: 0.6, tint: '#7c3aed', model: MODEL },
  { id: 'stone-wave', name: 'Stone Wave', heightM: 0.9, widthM: 1.4, depthM: 0.5, tint: '#475569', model: MODEL },
  { id: 'seed-pod', name: 'Seed Pod', heightM: 1.0, widthM: 0.7, depthM: 0.7, tint: '#15803d', model: MODEL },
];

export const findSculpture = (id) => SCULPTURES.find((sculpture) => sculpture.id === id) || null;

// The size line shown on a card and in the room, e.g. "H 1.8 m  W 0.4 m  D 0.4 m".
export const sizeText = (s) => `H ${s.heightM} m  W ${s.widthM} m  D ${s.depthM} m`;

// The caption that goes with a shared screenshot.
export const shareCaption = (s) => `${s.name}, ${s.heightM} m tall, placed in my room with RoomGallery`;
