import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ARButton } from 'three/addons/webxr/ARButton.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { AmmoManager } from './ammomanager';
import { BloonManager } from './bloonmanager';

let container;
let camera, scene, renderer, clock;
let controller1, controller2;

let ammoMngr = new AmmoManager();
let bloonMngr = new BloonManager();

let raycaster;

const intersected = [];
const tempMatrix = new THREE.Matrix4();

init();
animate();

function init() {

  container = document.createElement('div');
  document.body.appendChild(container);

  scene = new THREE.Scene();
  clock = new THREE.Clock();

  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10);
  camera.position.set(0, 0, 3);

  const controls = new OrbitControls(camera, container);
  controls.minDistance = 0;
  controls.maxDistance = 8;

  scene.add(new THREE.HemisphereLight(0x808080, 0x606060));

  const light = new THREE.DirectionalLight(0xffffff);
  light.position.set(0, 6, 0);
  scene.add(light);

  //

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.xr.enabled = true;
  container.appendChild(renderer.domElement);

  document.body.appendChild(ARButton.createButton(renderer));

  // controllers

  controller1 = renderer.xr.getController(0);
  // controller1.addEventListener('selectstart', onSelectStart);
  // controller1.addEventListener('selectend', onSelectEnd);
  scene.add(controller1);

  controller2 = renderer.xr.getController(1);
  // controller2.addEventListener('selectstart', onSelectStart);
  // controller2.addEventListener('selectend', onSelectEnd);
  scene.add(controller2);

  raycaster = new THREE.Raycaster();

  //

  window.addEventListener('resize', onWindowResize);

  //

  ammoMngr.setScene(scene);
  bloonMngr.setScene(scene);

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

}

// function onSelectStart(event) {

//   const controller = event.target;

//   const intersections = getIntersections(controller);

//   if (intersections.length > 0) {

//     const intersection = intersections[0];

//     const object = intersection.object;
//     object.material.emissive.b = 1;
//     controller.attach(object);

//     controller.userData.selected = object;

//   }

// }

// function onSelectEnd(event) {

//   const controller = event.target;

//   if (controller.userData.selected !== undefined) {

//     const object = controller.userData.selected;
//     object.material.emissive.b = 0;
//     group.attach(object);

//     controller.userData.selected = undefined;

//   }


// }

// function getIntersections(controller) {

//   tempMatrix.identity().extractRotation(controller.matrixWorld);

//   raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
//   raycaster.ray.direction.set(0, 0, - 1).applyMatrix4(tempMatrix);

//   return raycaster.intersectObjects(group.children, false);

// }

// function intersectObjects(controller) {

//   // Do not highlight when already selected

//   if (controller.userData.selected !== undefined) return;

//   const intersections = getIntersections(controller);

//   if (intersections.length > 0) {

//     const intersection = intersections[0];

//     const object = intersection.object;
//     object.material.emissive.r = 1;
//     intersected.push(object);

//   }

// }

// function cleanIntersected() {

//   while (intersected.length) {

//     const object = intersected.pop();
//     object.material.emissive.r = 0;

//   }

// }

//

function animate() {

  renderer.setAnimationLoop(render);

}

function render() {
  let delta = clock.getDelta();
  let elapsed = clock.elapsedTime;

  // cleanIntersected();

  // intersectObjects(controller1);
  // intersectObjects(controller2);

  ammoMngr.updateAmmosPositions(elapsed, delta);
  bloonMngr.updateBloonsPositions(delta);

  renderer.render(scene, camera);

}

setTimeout(() => ammoMngr.addAmmo(camera, 5000), 5000);
setTimeout(() => bloonMngr.addBloon(0), 4000);
setTimeout(() => bloonMngr.addBloon(1), 3000);
setTimeout(() => bloonMngr.addBloon(2), 2000);
setTimeout(() => bloonMngr.addBloon(3), 1000);