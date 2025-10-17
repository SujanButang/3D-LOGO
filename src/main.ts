import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import "./style.css";
import { FontLoader, TextGeometry } from "three/examples/jsm/Addons.js";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

// --- Scene setup ---
const scene = new THREE.Scene();
scene.background = new THREE.Color("white");
const logo = new THREE.Group();
const logoWithText = new THREE.Group();

// --- Camera setup ---
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  100,
  10000,
);
camera.position.z = 500;
scene.add(camera);

// --- Renderer ---
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// --- Controls ---
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// --- Lighting ---
scene.add(new THREE.AmbientLight(0xffffff, 0.6));

// --- Create base quarter shape ---
const baseShape = new THREE.Shape();
baseShape.moveTo(0, 0);
baseShape.lineTo(17, 0);
baseShape.bezierCurveTo(17, 0, 16.5, -3, 16, -6);
baseShape.lineTo(8, -6);
baseShape.lineTo(13, -11);
baseShape.bezierCurveTo(13, -11, 12, -13, 9, -15);
baseShape.lineTo(4, -10);
baseShape.lineTo(4, -18);
baseShape.bezierCurveTo(4, -18, 3, -18.5, -2, -19);
baseShape.lineTo(-2, -2);
baseShape.bezierCurveTo(-2, -2, -1, -1, 0, 0);

const extrudeSettings = { depth: 5, bevelEnabled: false };
const geometry = new THREE.ExtrudeGeometry(baseShape, extrudeSettings);
geometry.translate(0, 0, -1);

// --- Utility to create colored quarter ---
const createQuarter = (
  color: string,
  rotation: THREE.Euler,
  position: THREE.Vector3,
) => {
  const material = new THREE.MeshBasicMaterial({ color });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.copy(rotation);
  mesh.position.copy(position);
  mesh.position.z = 0;
  return mesh;
};

// --- Add all 4 quarters ---
logo.add(
  createQuarter(
    "#22B573",
    new THREE.Euler(0, 0, 0),
    new THREE.Vector3(0, 0, 0),
  ),
  createQuarter(
    "#29ABE2",
    new THREE.Euler(0, Math.PI, 0),
    new THREE.Vector3(-7, 0, 0),
  ),
  createQuarter(
    "#9F1EBA",
    new THREE.Euler(0, Math.PI, Math.PI * 0.5),
    new THREE.Vector3(-5, 5, 0),
  ),
  createQuarter(
    "#D4145A",
    new THREE.Euler(0, Math.PI, Math.PI),
    new THREE.Vector3(0, 3, 0),
  ),
);

// Center the logo horizontally
const logoBox = new THREE.Box3().setFromObject(logo);
const logoCenter = logoBox.getCenter(new THREE.Vector3());
logo.position.x -= logoCenter.x; // centers the logo horizontall

logoWithText.add(logo);

// --- Responsive resize handler ---
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// TEXT
const fontLoader = new FontLoader();
fontLoader.load("/FIGTREE.json", (font) => {
  const textGeo = new TextGeometry("ONEACCORD", {
    font: font,
    size: 30,
    depth: 5,
    curveSegments: 12,
    bevelEnabled: false,
  });

  // Center the text geometry
  textGeo.computeBoundingBox();
  const textBox = textGeo.boundingBox!;
  const textWidth = textBox.max.x - textBox.min.x;
  textGeo.translate(-textWidth / 2, 0, 0);

  const material = new THREE.MeshBasicMaterial({ color: "black" });
  const text = new THREE.Mesh(textGeo, material);

  // Position the text horizontally beside the logo
  const logoSize = new THREE.Box3()
    .setFromObject(logo)
    .getSize(new THREE.Vector3());
  text.position.x = logoSize.x / 2 + textWidth / 2 + 5;
  text.position.y = -logoSize.y * 0.35;

  logoWithText.add(text);
  logoWithText.scale.set(10, 10, 10);
  // --- Center the entire group ---
  const groupBox = new THREE.Box3().setFromObject(logoWithText);
  const groupCenter = groupBox.getCenter(new THREE.Vector3());
  logoWithText.position.x -= groupCenter.x;
  logoWithText.position.y -= groupCenter.y;
  logoWithText.position.z -= groupCenter.z;
});

scene.add(logoWithText);

for (let i = 0; i <= 750; i++) {
  const decorativeLogo = logo.clone();
  decorativeLogo.position.x = (Math.random() - 0.5) * 10000;
  decorativeLogo.position.y = (Math.random() - 0.5) * 10000;
  decorativeLogo.position.z = (Math.random() - 0.5) * 10000;

  decorativeLogo.rotation.x = Math.random() * Math.PI;
  decorativeLogo.rotation.z = Math.random() * Math.PI;

  const scale = Math.random() * 10;
  decorativeLogo.scale.set(scale, scale, scale);
  scene.add(decorativeLogo);
}

// --- Animation loop ---
const animate = () => {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};
animate();
