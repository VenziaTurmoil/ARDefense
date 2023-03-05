import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ARButton } from 'three/addons/webxr/ARButton.js';
import { AmmoManager } from './ammomanager';
import { BloonManager } from './bloonmanager';
import { RoundManager } from './roundmanager';

let container;
let camera, scene, renderer, clock;
let controller1, controller2;

const STEPS_PER_FRAME = 4;

let ammoMngr = new AmmoManager();
let bloonMngr = new BloonManager();
let roundMngr = new RoundManager(bloonMngr);

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
  controller1.addEventListener('selectstart', onSelectStart);
  controller1.addEventListener('selectend', onSelectEnd);
  scene.add(controller1);

  controller2 = renderer.xr.getController(1);
  controller2.addEventListener('selectstart', onSelectStart);
  controller2.addEventListener('selectend', onSelectEnd);
  scene.add(controller2);

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

//

function onSelectStart() {
}

function onSelectEnd() {
  document.getElementById("createRoundDiv").style.display= "inline-block";
}

function animate() {

  renderer.setAnimationLoop(render);

}

function render() {

  for (let i = 0; i < STEPS_PER_FRAME; i++) {
    let delta = clock.getDelta();
    let elapsed = clock.elapsedTime;

    let collitions = ammoMngr.detectCollisions(bloonMngr.bloonArray)
    ammoMngr.affectCollisions(collitions);
    ammoMngr.updateAmmosPositions(elapsed, delta);
    bloonMngr.updateBloonsPositions(delta);
  }

  renderer.render(scene, camera);

}