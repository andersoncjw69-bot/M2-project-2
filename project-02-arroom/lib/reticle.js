import * as THREE from 'three';

// Provided (from Activity 06): the green ring that marks where a tap would land on the floor.
export function makeReticle() {
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(0.12, 0.16, 32),
    new THREE.MeshBasicMaterial({ color: 0x00ff88, side: THREE.DoubleSide })
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.01;
  return ring;
}
