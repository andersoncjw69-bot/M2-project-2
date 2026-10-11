import * as THREE from 'three';

const raycaster = new THREE.Raycaster();

// TODO 2: Find the point on the virtual floor under a finger.
//
// Outcome: floorPoint(touch, size, camera, floor) returns a THREE.Vector3 where the ray from the camera through the
// touch meets the floor, or null when the ray misses it (the sky) or the view has no size yet.
// touch is { x, y } in pixels from the top-left of the view; size is { width, height } of that view.
// The caller moves the reticle there, so the returned point must be a copy it can keep.
// Verify:  a touch in the middle of the view returns a point near the floor's centre in front of the camera; a touch at
// the very top returns null. In the room, dragging a finger slides the green ring over the floor.
// Reflect (in your Notes doc): the touch is in pixels but the ray needs numbers from -1 to 1. Which way does y flip, and why?
//
// Your code below ↓
export function floorPoint(touch, size, camera, floor) {
  if (!touch || !size || !camera || !floor) return null;
  if (!size.width || !size.height || size.width <= 0 || size.height <= 0) return null;

  const ndcX = (touch.x / size.width) * 2 - 1;
  const ndcY = -(touch.y / size.height) * 2 + 1;

  raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);
  const intersects = raycaster.intersectObject(floor, false);

  if (intersects.length > 0) {
    return intersects[0].point.clone();
  }
  return null;
}
