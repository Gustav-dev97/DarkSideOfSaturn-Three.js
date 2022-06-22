import './style.css'
import * as THREE from 'three';
import * as POSTPROCESSING from 'postprocessing';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

'use strict ';

// Scene
let scene = new THREE.Scene();
// Background
const loader = new THREE.TextureLoader();
const spaceTexture = loader.load('images/espaco.jpg');
scene.background = spaceTexture;

// Camera
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.setZ(90);
camera.position.setX(-3);

// Renderer
let renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#main-content')
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const canvas = renderer.domElement;
camera.aspect = canvas.clientWidth / canvas.clientHeight;

//Texture Loader
const normalTexture = loader.load('images/normal.jpg');

// Geometrias
const icosahedronGeometry = new THREE.IcosahedronGeometry(18, 8);
const icosahedronMaterial = new THREE.MeshPhongMaterial({
    color: 0x000000,
    normalMap: normalTexture,
    metalness: 0.7,
    roughness: 0.2,
});
const icosahedron = new THREE.Mesh(icosahedronGeometry, icosahedronMaterial);
icosahedron.position.set(1, 1);
scene.add(icosahedron);

const torusGeometry = new THREE.TorusGeometry(45, 10, 16 , 100, 10);
const torusMaterial = new THREE.PointsMaterial({
    size: 0.005,
    normalMap: normalTexture,
    transparent: true,
    opacity: 0.9
});

const torus = new THREE.Points(torusGeometry, torusMaterial);
icosahedron.add(torus);

let circleGeo = new THREE.SphereGeometry(105);
let circleMat = new THREE.MeshBasicMaterial({ color: 0xFDA50F });
let circle = new THREE.Mesh(circleGeo, circleMat);
circle.position.set(17, 5, -500);
circle.scale.setX(1.2);
scene.add(circle);

// God rays
let godraysEffect = new POSTPROCESSING.GodRaysEffect(camera, circle, {
    resolutionScale: 1,
    density: 1,
    decay: 0.98,
    weight: 1,
    samples: 100
});

let renderPass = new POSTPROCESSING.RenderPass(scene, camera);
let effectPass = new POSTPROCESSING.EffectPass(camera, godraysEffect);
effectPass.renderToScreen = true;

let composer = new POSTPROCESSING.EffectComposer(renderer);
composer.addPass(renderPass);
composer.addPass(effectPass);

// const controls = new OrbitControls(camera, renderer.domElement);

/*
 * adicionar estrelas
 */
 function addEstrelas() {
     const estrelaGeometry = new THREE.SphereGeometry(0.30, 24, 24);
     const estrelaMaterial = new THREE.MeshBasicMaterial({
         color: 0xFFFFFF,
         transparent: true,
         opacity: 0.6
     });
     const estrela = new THREE.Mesh(estrelaGeometry, estrelaMaterial);

     const [x, y, z] = Array(3).fill(1).map(() => THREE.MathUtils.randFloatSpread(100));
     estrela.position.set(x, y, z);

     icosahedron.add(estrela);
 }
 Array(100).fill(100).forEach(addEstrelas);

// Event Listener para resize
window.addEventListener('resize', telaResize);

/*
 * funcao para fazer o Resize da tela  
 */
function telaResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
}

/*
 * animar forma geometrica  
 */
function animate() {
    requestAnimationFrame(animate);

    icosahedron.rotation.y += 0.008;
    torus.rotation.setFromVector3(new THREE.Vector3( Math.PI / 1.5, 0.5, 0));

    //renderer.render(scene, camera);
    composer.render(0.1);
    //controls.update();
}

animate();