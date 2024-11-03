import * as THREE from "three";
import { FirstPersonControls } from "three/addons/controls/FirstPersonControls.js";

const clock = new THREE.Clock();

function resizeRendererToDisplaySize(renderer: THREE.Renderer) {
  const canvas = renderer.domElement;
  const pixelRatio = window.devicePixelRatio;
  const width = Math.floor(canvas.clientWidth * pixelRatio);
  const height = Math.floor(canvas.clientHeight * pixelRatio);
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

const canvas = document.querySelector("#c");
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: canvas as HTMLCanvasElement,
});

const fov = 75;
const aspect = 2;
const near = 0.1; // Keep this small for close objects
const far = 1000; // Increase this significantly (was 5)
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 4;

const scene = new THREE.Scene();
scene.background = new THREE.Color("white");

const controls = new FirstPersonControls(camera, renderer.domElement);
console.log(controls);
controls.lookSpeed = 0.1; // Reduced from 0.8 for smoother looking
controls.movementSpeed = 5;
controls.autoForward = false; // Add this to prevent continuous movement
controls.activeLook = true; // Ensures looking is enabled
controls.mouseDragOn = false; // Prevents continuous movement after mouse drag
controls.constrainVertical = true; // Optional: prevents over-rotation up/down
controls.verticalMin = 1.0;
controls.verticalMax = 2.0;
scene.add(controls.object);

// Add these at the top level of your code
let moveUp = false;
let moveDown = false;
const moveSpeed = 0.1; // Adjust this value to control movement speed

// Add event listeners for keydown and keyup
window.addEventListener("keydown", (event) => {
  switch (event.code) {
    case "Space":
      moveUp = true;
      event.preventDefault(); // Prevent page scrolling
      break;
    case "ShiftLeft":
    case "ShiftRight":
      moveDown = true;
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.code) {
    case "Space":
      moveUp = false;
      break;
    case "ShiftLeft":
    case "ShiftRight":
      moveDown = false;
      break;
  }
});

const boxWidth = 1;
const boxHeight = 1;
const boxDepth = 1;
const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

function makeInstance(
  geometry: THREE.BufferGeometry,
  color: THREE.ColorRepresentation,
  x: number
) {
  const material = new THREE.MeshPhongMaterial({ color });

  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  cube.position.x = x;

  return cube;
}

const cubes = [
  makeInstance(geometry, "lightblue", 0),
  makeInstance(geometry, 0x8844aa, -2),
  makeInstance(geometry, 0xaa8844, 2),
];

const color = 0xffffff;
const intensity = 3;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(-1, 2, 4);
scene.add(light);

renderer.render(scene, camera);

function render(time: number) {
  time *= 0.001; // convert time to seconds

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  // Handle vertical movement
  if (moveUp) {
    camera.position.y += moveSpeed;
  }
  if (moveDown) {
    camera.position.y -= moveSpeed;
  }

  controls.update(clock.getDelta());

  cubes.forEach((cube, ndx) => {
    const speed = 1 + ndx * 0.1;
    const rot = time * speed;
    cube.rotation.x = rot;
    cube.rotation.y = rot;
  });

  renderer.render(scene, camera);

  // controls.

  requestAnimationFrame(render);
}
requestAnimationFrame(render);
