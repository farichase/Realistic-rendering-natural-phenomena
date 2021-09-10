import cloudTexture from '../../smoke1.png';
import dropTexture from '../../drop2.png';
import THREELib from "three-js";
import background from "./sky.jpg";
const THREE = THREELib(); 


let camera,
    scene,
    webGLRenderer, 
    lightning, 
    rainSystem, 
    particles, 
    pCount, 
    clouds,
    cloudsCount;
let backgroundScene;
let backgroundCamera;
class Colors {
  fogColor = 0x000000;
  ambientLight = 0x555555;
  directionalLight = 0x00004d;
  lightningLight = 0xffffff;
  rainColor = 0xffffff;
}
export default function init() {
  let time = performance.now();
  const rainElement = document.getElementById("rain");
  scene = new THREE.Scene();
  const nearPlan = 70, farPlan = 1000, fieldOfView = 100;
  camera = new THREE.PerspectiveCamera(
    fieldOfView, 
    window.innerWidth / window.innerHeight, 
    nearPlan, 
    farPlan
  );
  webGLRenderer = new THREE.WebGLRenderer({
    alpha: true
  });

  const colors = new Colors();
  const near = 0;
  const far = 800;
  scene.fog = new THREE.Fog(colors.fogColor, near, far);
  scene.background = new THREE.Color(colors.fogColor);
  const width = 1024;
  const height = 768;
  webGLRenderer.setSize(width, height);
  
  rainElement.append(webGLRenderer.domElement);
  addBackground();
  addLight();
  addRain();
  addClouds();
  render();
  console.log('Time = ', performance.now() - time);
}
function addBackground(){
  let texture = THREE.ImageUtils.loadTexture(background);
  var backgroundMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2, 0),
    new THREE.MeshBasicMaterial({
        map: texture
    }));

  backgroundMesh.material.depthTest = false;
  backgroundMesh.material.depthWrite = false;

  backgroundScene = new THREE.Scene();
  backgroundCamera = new THREE.Camera();
  backgroundScene.add(backgroundCamera );
  backgroundScene.add(backgroundMesh );
}
function addLight(){
  const colors = new Colors();
  const lightIntensity = 2;
  const ambient = new THREE.AmbientLight(colors.ambientLight, lightIntensity); //свет, освещающий сцену
  scene.add(ambient);
  const directional = new THREE.DirectionalLight(colors.directionalLight, lightIntensity); 
  let px = 0; 
  let py = 300; 
  let pz = 300;
  directional.position.set(px, py, pz);
  scene.add(directional);
  const lightningIntensity = 0, distance = 1000, decay = 3;
  lightning = new THREE.PointLight(colors.lightningLight, lightningIntensity, distance, decay); //молния
  scene.add(lightning);
}
function addClouds(){
  const geometry = new THREE.PlaneGeometry(1000, 1200);
  const texture = THREE.ImageUtils.loadTexture(cloudTexture);
  const material = new THREE.MeshLambertMaterial();
  material.map = texture;
  material.transparent = true;
  clouds = new Array(cloudsCount);
  cloudsCount = 50;
  for (let p = 0; p < cloudsCount; p++) {
    const mesh = new THREE.Mesh(geometry, material);
    let px = -Math.random() * 600 - 300; 
    const py = 350; 
    let pz = Math.random() * 200 - 520;
    if (Math.random() * 100 > 50){
      px = Math.random() * 2000 - 300; 
    } 
    mesh.material.opacity = 0.5;
    mesh.position.set(px, py, pz);
    mesh.rotation.x = camera.rotation.x;
    mesh.rotation.y = camera.rotation.y;
    mesh.rotation.z = Math.random() * 360;
    scene.add(mesh);
    clouds[p] = mesh;
  }
}

function addRain(){
  pCount = 5000
  particles = new THREE.Geometry();
  const texture = THREE.ImageUtils.loadTexture(dropTexture);
  const colors = new Colors();
  const material = new THREE.ParticleBasicMaterial({
    map: texture,
    color: colors.rainColor,
    size: 0.8,
    transparent: true,
  });
  for (let i = 0; i < pCount; i++) {
    const px = Math.random() * 500 - 250;
    const py = Math.random() * 500 - 250;
    const pz = Math.random() * 500 - 250;
    const drop = new THREE.Vector3(px, py, pz);
    drop.velocity = 0;
    particles.vertices.push(drop);
  }

  rainSystem = new THREE.Points(particles, material);
  scene.add(rainSystem);
}

function resize() {
  const domElem = webGLRenderer.domElement;
  let width = domElem.clientWidth;
  let height = domElem.clientHeight;
  let is_resize = domElem.width !== width || domElem.height !== height;
  if (is_resize) {
    webGLRenderer.setSize(width, height, false);
  }
  return is_resize;
}

function render() {
  webGLRenderer.autoClear = false;
  webGLRenderer.clear();
  webGLRenderer.render(backgroundScene , backgroundCamera );
  webGLRenderer.render(scene, camera);
  requestAnimationFrame(render);
  if (resize()) {
    let domElem = webGLRenderer.domElement;
    camera.aspect = domElem.clientWidth / domElem.clientHeight;
    camera.updateProjectionMatrix();
  }
  for (let i = 0; i < pCount; i++){
    let particle = particles.vertices[i];
    if (particle.y < -100){
      particle.y = -particle.y;
      particle.velocity = 0;
    }
    particle.velocity -= Math.random() * 0.05;
    particle.y += particle.velocity;
  }
  particles.verticesNeedUpdate = true;
  if (Math.random() * 100 > 99.7 || lightning.power > 100) {
    if (lightning.power < 100){
      const px = Math.random() * 400; 
      const py = 100; 
      const pz = 100;
      lightning.position.set(px, py, pz);
    }
    lightning.power = Math.random() * 500;
  }
  for (let i = 0; i < cloudsCount; i++){
    clouds[i].rotation.z -=0.001;
  }

}
