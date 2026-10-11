import * as THREE from 'three';

// TODO 4: Stand a sculpture at its real size on the floor.
//
// Outcome: placeSculpture(original, sculpture, point) returns a new THREE.Group holding a COPY of original (never
// the original itself, which stays untouched for the next placement). The copy is stretched so its box is
// exactly sculpture.widthM wide, heightM tall and depthM deep, and its lowest point rests on the floor.
// The group sits at point.x, point.z on the floor, has scale 1 (so the pinch in TODO 5 starts from true size),
// and carries userData { isPlaced: true, sculptureId: sculpture.id } so it can be told apart from everything else.
// Verify:  place "Tide Pillar": its box measures 0.4 x 1.8 x 0.4 and its lowest point is at y = 0. Place it twice:
// two separate groups, and the original's position and scale are unchanged.
// Reflect (in your Notes doc): what goes wrong when two placements share one object instead of a clone?
//
// Your code below ↓
export function placeSculpture(original, sculpture, point) {
  const group = new THREE.Group();
  const posX = point ? point.x : 0;
  const posZ = point ? point.z : 0;
  group.position.set(posX, 0, posZ);
  group.scale.set(1, 1, 1);
  group.userData = { isPlaced: true, sculptureId: sculpture.id };

  if (original) {
    const copy = original.clone(true);

    const box = new THREE.Box3().setFromObject(copy);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    const scaleX = size.x > 0 ? sculpture.widthM / size.x : 1;
    const scaleY = size.y > 0 ? sculpture.heightM / size.y : 1;
    const scaleZ = size.z > 0 ? sculpture.depthM / size.z : 1;

    copy.scale.set(scaleX, scaleY, scaleZ);
    copy.position.set(-center.x * scaleX, -box.min.y * scaleY, -center.z * scaleZ);

    group.add(copy);
  }

  return group;
}
