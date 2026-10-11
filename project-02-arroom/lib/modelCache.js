import { Asset } from 'expo-asset';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// TODO 3: Load each model once.
//
// Outcome: createModelCache(load) returns { get(key) }. get(key) resolves to the model for that key, calling
// load(key) only the first time: a second call, even one made while the first is still loading, shares that
// one load instead of starting another. If a load fails, the failure is passed on and the next get(key)
// tries again. Different keys are cached separately.
// Verify:  call get twice for the same key, one straight after the other: load ran once and both calls got the same
// object. Make load fail once: the first get rejects, the second succeeds.
// Reflect (in your Notes doc): the room places the same sculpture many times. What would happen on a phone without the cache?
//
// Your code below ↓
export function createModelCache(load) {
  const cache = new Map();

  return {
    get(key) {
      if (cache.has(key)) {
        return cache.get(key);
      }

      const promise = (async () => {
        try {
          return await load(key);
        } catch (err) {
          cache.delete(key);
          throw err;
        }
      })();

      cache.set(key, promise);
      return promise;
    },
  };
}

// Provided: loads a bundled .glb (the number you get from require('./x.glb')) into a three.js scene graph.
export async function loadGlb(moduleId) {
  const asset = Asset.fromModule(moduleId);
  await asset.downloadAsync();
  return new Promise((resolve, reject) => {
    new GLTFLoader().load(asset.localUri || asset.uri, (gltf) => resolve(gltf.scene), undefined, reject);
  });
}

// Provided: the cache the room uses. Never move or edit what it returns: clone it (TODO 4).
export const sculptureModels = createModelCache(loadGlb);
