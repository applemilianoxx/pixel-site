import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { FBXLoader } from 'three-stdlib';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry';

export default function CryptoRunner() {
  const mountRef = useRef(null);

  useEffect(() => {
    // Prevent scrolling
    document.body.style.margin = '0';
    document.body.style.overflow = 'hidden';

let gameOver = false;
let gameStarted = false;



    // BTC counter
    let btcCollected = 0;
    const counterDiv = document.createElement('div');
Object.assign(counterDiv.style, {
  position: 'absolute',
  top: '20px',
  left: '20px',
  color: '#00ff00',
  fontSize: '20px',
  fontFamily: '"Press Start 2P", monospace',
  backgroundColor: '#000',
  padding: '10px 14px',
  border: '2px solid #00ff00',
  textShadow: '0 0 5px #00ff00, 0 0 10px #00ff00',
  zIndex: '1',
});

    counterDiv.innerText = `BTC Collected: 0`;
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
    document.body.appendChild(counterDiv);

    // Scene, camera, renderer
    const scene = new THREE.Scene();

// Stars
const starCount = 3000;
const radius = 500;

const starGeometry = new THREE.BufferGeometry();
const starPositions = [];

for (let i = 0; i < starCount; i++) {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  const r = radius * Math.pow(Math.random(), 0.5); // denser near center

  const x = r * Math.sin(phi) * Math.cos(theta);
  const y = r * Math.sin(phi) * Math.sin(theta);
  const z = r * Math.cos(phi);

  starPositions.push(x, y, z);
}


starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));

const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 1,
  sizeAttenuation: true
});

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

    scene.background = new THREE.Color(0x000010); // near-black blue
    scene.fog = new THREE.Fog(0x1a1a2e, 5, 80);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 6);
    camera.lookAt(0, 1, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(window.innerWidth, window.innerHeight);

    if (mountRef.current) {
      mountRef.current.innerHTML = '';
      mountRef.current.appendChild(renderer.domElement);
    }
// Freeze game at start
let countdownDiv = document.createElement('div');
countdownDiv.innerText = '3';
Object.assign(countdownDiv.style, {
  position: 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  color: '#ffffff',
  fontSize: '60px',
  fontFamily: '"Press Start 2P", monospace',
  textShadow: '0 0 10px #ffffff, 0 0 20px #00ffff',
  zIndex: '1',
});
document.body.appendChild(countdownDiv);

// Countdown logic
let count = 3;
const countdownInterval = setInterval(() => {
  count--;
  if (count > 0) {
    countdownDiv.innerText = count;
  } else {
    clearInterval(countdownInterval);
    document.body.removeChild(countdownDiv);
    gameStarted = true;
  }
}, 1000);

    // Lanes
    const lanes = [-2, 0, 2];

    // Sky setup
    const sky = new Sky();
    sky.scale.setScalar(450000);
    scene.add(sky);
    const sunUniforms = sky.material.uniforms;
    sunUniforms.turbidity.value = 1;
    sunUniforms.rayleigh.value = 1;
    sunUniforms.mieCoefficient.value = .1;
    sunUniforms.mieDirectionalG.value = 0.85;
    const phi = Math.PI * (0.49 - 0.5);
    const theta = 2 * Math.PI * (0.25 - 0.5);
    sunUniforms.sunPosition.value.copy(
      new THREE.Vector3(Math.cos(theta), Math.sin(phi), Math.sin(theta))
    );
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(sky).texture;

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.2));
    scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 0.6));
    const dirLight = new THREE.DirectionalLight(0xfff2cc, 3);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.set(4096, 4096);
    dirLight.shadow.radius = 5;
    scene.add(dirLight);
    const sunMesh = new THREE.Mesh(
      new THREE.SphereGeometry(5, 64, 64),
      new THREE.MeshBasicMaterial({ color: 0xffcc33 })
    );
    scene.add(sunMesh);

    // Ground segments
    const groundMat = new THREE.MeshPhysicalMaterial({ color: 0x222222, roughness: 0.8, metalness: 0.2 });
    const groundSegments = [];
    for (let i = 0; i < 20; i++) {
      const seg = new THREE.Mesh(new THREE.BoxGeometry(6, 0.5, 20), groundMat);
      seg.receiveShadow = true;
      seg.position.z = i * -20;
      scene.add(seg);
      groundSegments.push(seg);
    }

    // **Replace platforms with cars**
    const platforms = [];
    for (let i = 0; i < 10; i++) {
      const car = new THREE.Group();

      // Body
      const body = new THREE.Mesh(
        new RoundedBoxGeometry(4, 1, 2, 8, 0.2),
        new THREE.MeshPhysicalMaterial({
          color: 0x156289,
          metalness: 1,
          roughness: 0.2,
          clearcoat: 1,
          clearcoatRoughness: 0.05,
          envMapIntensity: 2
        })
      );
      body.castShadow = false;
      body.position.y = 1;
      car.add(body);

      // Cabin (trapezoid)
      const cabinGeom = new THREE.BufferGeometry();
      cabinGeom.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
        -1, 0, -0.7,
         1, 0, -0.7,
         1, 0,  0.7,
        -1, 0,  0.7,
        -0.6, 0.5, -0.5,
         0.6, 0.5, -0.5,
         0.6, 0.5,  0.5,
        -0.6, 0.5,  0.5
      ]), 3));
      cabinGeom.setIndex([
        0,1,2, 0,2,3,
        4,5,6, 4,6,7,
        0,1,5, 0,5,4,
        1,2,6, 1,6,5,
        2,3,7, 2,7,6,
        3,0,4, 3,4,7
      ]);
      cabinGeom.computeVertexNormals();
const cabin = new THREE.Mesh(
  cabinGeom,
  new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.7,
    roughness: 0.2,
    clearcoat: 0.5,
    clearcoatRoughness: 0.1,
    envMapIntensity: 2,
    side: THREE.DoubleSide
  })
);

      cabin.castShadow = true;
      cabin.position.set(0, 1.5, 0);
      car.add(cabin);


      // Headlights + Glow
      const headlightMat = new THREE.MeshStandardMaterial({ emissive: 0xffffee, emissiveIntensity: 4 });
      [[2, 1.2, 0.8], [2, 1.2, -0.8]].forEach(([x, y, z]) => {
        const headlight = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), headlightMat);
        headlight.position.set(x, y, z);
        const light = new THREE.PointLight(0xffffee, 1, 5);
        light.position.set(x, y, z);

        const spriteMaterial = new THREE.SpriteMaterial({
          map: new THREE.TextureLoader().load('https://threejs.org/examples/textures/lensflare/lensflare0.png'),
          blending: THREE.AdditiveBlending,
          transparent: true,
          depthWrite: false,
          depthTest: false

        });
        const glow = new THREE.Sprite(spriteMaterial);
        glow.scale.set(.5, .5, .5);
        glow.position.set(x + 0.05, y + 0.02, z);

        car.add(headlight);
        car.add(light);
        car.add(glow);
      });



      // Position & Track
let carX, carZ;
let safe = false;

while (!safe) {
  carX = lanes[Math.floor(Math.random() * lanes.length)];
  carZ = -Math.random() * 200;

  safe = !platforms.some(existing =>
    Math.abs(existing.position.x - carX) < 1 &&
    Math.abs(existing.position.z - carZ) < 10
  );
}

car.position.set(carX, 1.5, carZ);

      scene.add(car);
car.rotation.y = -Math.PI / 2;
      platforms.push(car);
    }

    // Coins
    const coinMat = new THREE.MeshPhysicalMaterial({ color: 0xf7931a, emissive: 0xf7931a });
    const btcCoins = [];
    for (let i = 0; i < 50; i++) {
      const coin = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.3, 0.1, 64),
        coinMat
      );
      coin.rotation.x = Math.PI / 2;
      coin.position.set(
        lanes[Math.floor(Math.random() * lanes.length)],
        1,
        -Math.random() * 400
      );
      scene.add(coin);
      btcCoins.push(coin);
    }

    // Player setup and loader
    let player = new THREE.Object3D();
    player.position.set(0, 0.1, 0);
    let mixer;
    const loader = new FBXLoader();
    loader.load('/Running.fbx', (model) => {
      player = model;
player.visible = true;
      player.scale.set(0.02, 0.02, 0.02);
      player.position.set(0, .8, 0);
      player.traverse((ch) => ch.isMesh && (ch.castShadow = true));
      scene.add(player);
      // Reverse animation direction and flip model
      mixer = new THREE.AnimationMixer(player);
if (model.animations[0]) {
  // strip out any root‑motion position tracks
  const rawClip = model.animations[0];
  const filteredTracks = rawClip.tracks.filter(t => !/\.position$/.test(t.name));
  const clip = new THREE.AnimationClip(rawClip.name, rawClip.duration, filteredTracks);

  const action = mixer.clipAction(clip);
  action.setLoop(THREE.LoopRepeat);
  action.clampWhenFinished = false;
  action.play();
  action.timeScale = 0.5;
  player.rotation.y = Math.PI;
}


    });

    // Controls
    let currentLane = 1;
    let moveCooldown = false;
    let velocityY = 0;
    let isJumping = false;
    const gravityForce = 0.01;
    window.addEventListener('keydown', (e) => {
      if (!moveCooldown) {
        if (e.key === 'ArrowLeft' && currentLane > 0) currentLane--;
        if (e.key === 'ArrowRight' && currentLane < lanes.length - 1) currentLane++;
        moveCooldown = true;
        setTimeout(() => (moveCooldown = false), 200);
      }
      if (e.code === 'Space' && player && !isJumping) {
        const above = platforms.some(
          (p) => Math.abs(player.position.x - p.position.x) < 1.5 &&
                  Math.abs(player.position.z - p.position.z) < 2 &&
                  player.position.y + 2 >= p.position.y
        );
        if (!above) { velocityY = 0.3; isJumping = true; }
      }
    });

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);

if (gameOver) return;

// game logic only runs if countdown finished
if (gameStarted) {
  if (mixer) mixer.update(0.016);

if (player && player.visible && platforms && platforms.length) {
  for (const car of platforms) {
    const carBox = new THREE.Box3();
    car.children.forEach(child => {
      if (child.type !== 'Sprite') {
        const box = new THREE.Box3().setFromObject(child);
        carBox.union(box);
      }
    });

    const playerBox = new THREE.Box3().setFromObject(player);

    if (playerBox.intersectsBox(carBox)) {
      const dx = Math.abs(player.position.x - car.position.x);
      const dz = player.position.z - car.position.z;

      if (dx < 0.03 && dz < 0.03 && dz > -0.03) {
        player.visible = false;
        triggerGameOver();
        break;
      }
    }
  }
}





  groundSegments.forEach(seg => {
    if (seg.position.z - player.position.z > 20) seg.position.z -= 400;
  });
  platforms.forEach(p => {
    if (p.position.z - player.position.z > 20) p.position.z -= 400;
  });

  player.position.z -= 0.25;
  const targetX = lanes[currentLane];
const blocked = platforms.some(car =>
  Math.abs(car.position.x - targetX) < 1.5 &&
  Math.abs(car.position.z - player.position.z) < 3
);

if (!blocked) {
  player.position.x += (targetX - player.position.x) * 0.2;
}

camera.position.set(0, 5, player.position.z + 10);
camera.lookAt(0, 1, player.position.z);


  if (isJumping) {
    player.position.y += velocityY;
    velocityY -= gravityForce;
    platforms.forEach(plat => {
      if (velocityY <= 0 &&
          Math.abs(player.position.x - plat.position.x) < 1.5 &&
          Math.abs(player.position.z - plat.position.z) < 2 &&
          player.position.y <= plat.position.y + 1.1) {
        player.position.y = plat.position.y + 1;
        isJumping = false;
        velocityY = 0;
      }
    });
    if (player.position.y <= 1) {
      player.position.y = 1;
      isJumping = false;
      velocityY = 0;
    }
  }

  btcCoins.forEach((coin, idx) => {
    coin.rotation.z += 0.05;
    coin.position.y = 1 + Math.sin(performance.now() * 0.002 + idx) * 0.1;
    if (coin.position.z - player.position.z > 50) {
      coin.position.set(
        lanes[Math.floor(Math.random() * lanes.length)],
        1,
        player.position.z - 100 - Math.random() * 200
      );
      coin.visible = true;
    }
    if (coin.visible &&
        Math.abs(coin.position.z - player.position.z) < 1 &&
        Math.abs(coin.position.x - player.position.x) < 0.6 &&
        Math.abs(coin.position.y - player.position.y) < 1.2) {
      btcCollected++;
      counterDiv.innerText = `BTC Collected: ${btcCollected}`;
      counterDiv.style.transform = 'scale(1.1)';
      setTimeout(() => { counterDiv.style.transform = 'scale(1)'; }, 150);
      coin.visible = false;
      createParticleBurst(coin.position);
    }
  });
}


      // Update lights & render
      dirLight.position.copy(sunUniforms.sunPosition.value).multiplyScalar(100).add(camera.position);
      sunMesh.position.copy(sunUniforms.sunPosition.value).multiplyScalar(100).add(camera.position);
      renderer.render(scene, camera);
    }

    animate();

function triggerGameOver() {
  gameOver = true;

  // Hide player
  player.visible = false;

  // Game Over Text
  const gameOverDiv = document.createElement('div');
  gameOverDiv.innerText = 'GAME OVER';
  Object.assign(gameOverDiv.style, {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: '#ff0000',
    fontSize: '48px',
    fontFamily: '"Press Start 2P", monospace',
    textShadow: '0 0 5px #ff0000, 0 0 15px #ff0000',
    zIndex: '2',
  });

  // Restart Button
  const restartBtn = document.createElement('button');
  restartBtn.innerText = 'RESTART';
  Object.assign(restartBtn.style, {
    position: 'absolute',
    top: '55%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: '10px 20px',
    fontSize: '20px',
    fontFamily: '"Press Start 2P", monospace',
    backgroundColor: '#000',
    color: '#00ff00',
    border: '2px solid #00ff00',
    cursor: 'pointer',
    zIndex: '2',
  });

  restartBtn.onclick = () => window.location.reload();

  document.body.appendChild(gameOverDiv);
  document.body.appendChild(restartBtn);
}


    // Particle burst effect
    function createParticleBurst(pos) {
      const count = 3;
      const geom = new THREE.BufferGeometry();
      const positions = [];
      const velocities = [];
      const colors = [];
      for (let i = 0; i < count; i++) {
        positions.push(pos.x, pos.y, pos.z);
        const v = new THREE.Vector3(
          (Math.random() - 0.5) * 0.2,
          Math.random() * 0.3,
          (Math.random() - 0.5) * 0.2
        );
        velocities.push(v.x, v.y, v.z);
        colors.push(1, Math.random() * 0.05 + 0.2, 0);
      }
      geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geom.setAttribute('velocity', new THREE.Float32BufferAttribute(velocities, 3));
      geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      const mat = new THREE.PointsMaterial({ size: 0.3, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true });
      const pts = new THREE.Points(geom, mat);
      scene.add(pts);
      const start = performance.now();
      function burst() {
        const elapsed = (performance.now() - start) / 1000;
        const posArr = geom.attributes.position.array;
        const velArr = geom.attributes.velocity.array;
        for (let i = 0; i < count; i++) {
          velArr[i * 3 + 1] -= 0.02;
          posArr[i * 3] += velArr[i * 3] * 0.3;
          posArr[i * 3 + 1] += velArr[i * 3 + 1] * 0.3;
          posArr[i * 3 + 2] += velArr[i * 3 + 2] * 0.3;
        }
        geom.attributes.position.needsUpdate = true;
        mat.opacity = THREE.MathUtils.clamp(1 - elapsed * 4, 0, 1);
        if (elapsed < 0.8) requestAnimationFrame(burst);
        else scene.remove(pts);
      }
      burst();
    }

    // Handle resize
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      document.body.style.margin = '';
      document.head.removeChild(fontLink);
      document.body.removeChild(counterDiv);
      if (mountRef.current) mountRef.current.innerHTML = '';
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-screen bg-black" />;
}
