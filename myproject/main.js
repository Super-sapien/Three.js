import './style.css'

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// scene == container
const scene = new THREE.Scene();
// field of view in three.js uses degrees, not radians
// PerspectiveCamera(field of view, aspect ratio / aspect ratio, view frustum, view frustum)
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);

// Renderer needs to know which DOM element to use
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

// Renderer makes the magic happen, Set render size to full screen, Position of z axis
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(10);

// render == DRAW
renderer.render(scene, camera);

// adding object. think of material as wrapping for geometry
const geometry = new THREE.TorusGeometry(10, .5 ,16, 100)

// const material = new THREE.MeshBasicMaterial( { color: 0xFF6347, wireframe: true } ); // doesn't show lighting
const material = new THREE.MeshStandardMaterial( { color: 0xFF6347 } ); // requires lighting
const torus = new THREE.Mesh(geometry, material);
const geometry2 = new THREE.TorusGeometry(6, .2 ,16, 5)
const material2 = new THREE.MeshStandardMaterial( { color: 0xFF5353 } ); // requires lighting
const torus2 = new THREE.Mesh(geometry2, material2);
scene.add(torus, torus2)

// pointlight lights in all directions. 0x = hexidecimal literal
const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(5,5,5)
// scene.add(pointLight)

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight)

const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper)

const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({color:0xffffff})
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star)

  // star.rotation.x += 0.02;
  // star.rotation.y += 0.02;
}

// how many stars (200)
Array(200).fill().forEach(addStar)

// add background image / texture
const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;

// texture mapping
const justinTexture = new THREE.TextureLoader().load('justinpic.png')
const justin = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({map: justinTexture})
);

scene.add(justin);


// moon

const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const normalTexture = new THREE.TextureLoader().load('normal.jpg');
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(8, 32, 32), // 3
  new THREE.MeshStandardMaterial( {
  map: moonTexture,
  normalMap: normalTexture
  } )
);

scene.add(moon);

// these two positions work same way
moon.position.z = 40; // 20
moon.position.setX(-20);
moon.position.y = .1;

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.015;
  moon.rotation.y += 0.015;
  // moon.rotation.z += 12.05;

  justin.rotation.y += 0.01;
  justin.rotation.z += 0.01;

  // camera.position.z = t * -0.01;
  // camera.position.x = t * -0.0002;
  // camera.position.y = t * -0.0002;

  // camera.position.z = t * -0.01;
  camera.position.x = t * -0.01;
  camera.position.y = t * -0.01;
}

document.body.onscroll = moveCamera


function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.002;
  torus.rotation.y += 0.002;
  // torus.rotation.z += 0.118;
  torus2.rotation.x += -0.002;
  torus2.rotation.y += -0.002;
  controls.update();

  renderer.render(scene, camera);
}

animate()