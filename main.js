const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("solarCanvas") });
renderer.setSize(window.innerWidth, window.innerHeight);

// Texture loader
const textureLoader = new THREE.TextureLoader();
scene.background = textureLoader.load("textures/stars.jpg");

// Lighting
const sunLight = new THREE.PointLight(0xffffff, 2, 1000);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

// Sun
const sunTexture = textureLoader.load("textures/sun.jpg");
const sun = new THREE.Mesh(
  new THREE.SphereGeometry(2.5, 64, 64),
  new THREE.MeshBasicMaterial({ map: sunTexture })
);
scene.add(sun);

// Planet data
const planetData = [
  { name: "Mercury", size: 0.3, distance: 5, speed: 0.02, texture: "textures/mercury.jpg" },
  { name: "Venus", size: 0.5, distance: 7, speed: 0.015, texture: "textures/venus.jpg" },
  { name: "Earth", size: 0.6, distance: 9, speed: 0.012, texture: "textures/earth.jpg" },
  { name: "Mars", size: 0.5, distance: 11, speed: 0.01, texture: "textures/mars.jpg" },
  { name: "Jupiter", size: 1.2, distance: 14, speed: 0.008, texture: "textures/jupiter.jpg" },
  { name: "Saturn", size: 1.0, distance: 17, speed: 0.006, texture: "textures/saturn.jpg" },
  { name: "Uranus", size: 0.9, distance: 20, speed: 0.004, texture: "textures/uranus.jpg" },
  { name: "Neptune", size: 0.9, distance: 23, speed: 0.002, texture: "textures/neptune.jpg" }
];

const planets = [];
const angles = {};
const controls = document.getElementById("controls");

// Create planets and orbits
planetData.forEach(p => {
  const texture = textureLoader.load(p.texture);
  const material = new THREE.MeshStandardMaterial({ map: texture });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(p.size, 64, 64), material);
  scene.add(mesh);
  mesh.position.x = p.distance;

  planets.push({ name: p.name, mesh, distance: p.distance, speed: p.speed });
  angles[p.name] = Math.random() * Math.PI * 2;

  // Orbit ring
  const ringGeo = new THREE.RingGeometry(p.distance - 0.02, p.distance + 0.02, 64);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x444444, side: THREE.DoubleSide });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2;
  scene.add(ring);

  // Slider UI
  const label = document.createElement("label");
  label.innerHTML = `
    <strong>${p.name}</strong><br>
    <input type="range" min="0" max="0.05" step="0.001" value="${p.speed}" id="${p.name}-slider"><br>
  `;
  controls.appendChild(label);
});

// Camera position
camera.position.z = 35;

// Animation toggle
let isRunning = true;
document.getElementById("toggle-animation").onclick = () => {
  isRunning = !isRunning;
  document.getElementById("toggle-animation").textContent = isRunning ? "Pause" : "Resume";
};

// Animate
function animate() {
  requestAnimationFrame(animate);

  if (isRunning) {
    planets.forEach(p => {
      const slider = document.getElementById(`${p.name}-slider`);
      p.speed = parseFloat(slider.value);
      angles[p.name] += p.speed;
      const angle = angles[p.name];

      p.mesh.position.x = Math.cos(angle) * p.distance;
      p.mesh.position.z = Math.sin(angle) * p.distance;
      p.mesh.rotation.y += 0.01;
    });
  }

  renderer.render(scene, camera);
}

animate();

// Responsive
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
