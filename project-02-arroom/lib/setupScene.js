import { Renderer } from 'expo-three';
import * as THREE from 'three';

const patchWebGL = () => {
  if (typeof WebGLRenderingContext !== 'undefined') {
    try {
      Object.defineProperty(WebGLRenderingContext, Symbol.hasInstance, {
        value: () => false,
        configurable: true,
      });
      const Orig = WebGLRenderingContext;
      const Stub = function WebGLRenderingContext() {};
      Object.assign(Stub, Orig);
      if (typeof global !== 'undefined') global.WebGLRenderingContext = Stub;
      if (typeof globalThis !== 'undefined') globalThis.WebGLRenderingContext = Stub;
      if (typeof window !== 'undefined') window.WebGLRenderingContext = Stub;
    } catch (e) {}
  }
};
patchWebGL();

// Provided (from Activity 06): a transparent three.js scene with lights, an invisible floor at y = 0,
// and a render loop. The camera feed shows through because the clear colour has no alpha.
// Returns what the screen needs to keep working with the scene.
export function setupScene(gl, onFrame) {
  patchWebGL();

  const renderer = new Renderer({ gl, alpha: true });
  renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 100);
  camera.position.set(0, 1.4, 2.5);
  camera.lookAt(0, 0, 0);

  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const sun = new THREE.DirectionalLight(0xffffff, 0.8);
  sun.position.set(1, 2, 1);
  scene.add(sun);

  // An invisible plane lying flat: the floor your touches are tested against.
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshBasicMaterial({ visible: false }));
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  let frameId;
  const loop = () => {
    frameId = requestAnimationFrame(loop);
    if (onFrame) onFrame();
    renderer.render(scene, camera);
    gl.endFrameEXP();
  };
  loop();

  return { scene, camera, floor, stop: () => cancelAnimationFrame(frameId) };
}
