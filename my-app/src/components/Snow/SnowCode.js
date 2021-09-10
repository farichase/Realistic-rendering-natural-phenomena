import dropTexture from '../../snow.png';
import background from "./forest.jpg";
import THREELib from "three-js";
let THREE = THREELib(); 


let scene, 
    camera, 
    webGLRenderer, 
    snowSystem, 
    particles, 
    pCount;
let backgroundScene;
let backgroundCamera;
class Colors {
  fogColor = 0x1a162a;
  ambientLight = 0x555555;
  snowColor = 0xffffff;
}

export default function init() {
  let time = performance.now();
  scene = new THREE.Scene();
  const nearPlan = 35, farPlan = 1000, fieldOfView = 100;
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
  let snowElement = document.getElementById("snow");
  snowElement.append(webGLRenderer.domElement);

  addLight();
  addSnow();
  addBackground();
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
  let lightIntensity = 0.5;
  const ambient = new THREE.AmbientLight(colors.ambientLight, lightIntensity); //свет, освещающий сцену
  scene.add(ambient);
}
function addSnow(){
  pCount = 5000
  particles = new THREE.Geometry();
  const texture = THREE.ImageUtils.loadTexture(dropTexture);
  const colors = new Colors();
  const material = new THREE.ParticleBasicMaterial({
    map: texture,
    color: colors.snowColor,
    size: 0.35,
    transparent: true,
  });
  for (let i = 0; i < pCount; i++) {
    const px = Math.random() * 500 - 250;
    const py = Math.random() * 500 - 250;
    const pz = Math.random() * 500 - 250;
    const snowflake = new THREE.Vector3(px, py, pz);
    snowflake.velocity = 0;
    particles.vertices.push(snowflake);
  }
  snowSystem = new THREE.Points(particles, material);
  scene.add(snowSystem);
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
    if (particle.y < -200){
      particle.y = -particle.y;
      particle.velocity = 0;
    }
    particle.velocity -= Math.random() * 0.001;
    particle.y += particle.velocity;
  }
  particles.verticesNeedUpdate = true;
}
