import cloudTexture from '../../smoke1.png';
import THREELib from "three-js";
let THREE = THREELib(); 


let scene, 
    camera, 
    webGLRenderer, 
    clouds, 
    cloudsCount;
    
class Colors {
  fogColor = 0x7b96ba;
  ambientLight = 0x555555;
  light1 = 0xffff99; //канареечный
  light2 = 0xffa58a; //розовый
  light3 = 0xa2add0; //дикий синий
}

export default function init() {
  let time = performance.now();
  scene = new THREE.Scene();
  let aspectRatio = window.innerWidth / window.innerHeight;
  const nearPlan = 1;
  const farPlan = 1000;
  camera = new THREE.PerspectiveCamera(55, aspectRatio, nearPlan, farPlan);
  camera.rotation.x = 1.4;
  camera.rotation.y = -0.1;
  camera.rotation.z = 0.2;
  
  webGLRenderer = new THREE.WebGLRenderer();

  let colors = new Colors();
  const near = 0;
  const far = 800;
  scene.fog = new THREE.Fog(colors.fogColor, near, far);
  scene.background = new THREE.Color(colors.fogColor);
  let width = 1024;
  let height = 768;
  webGLRenderer.setSize(width, height);
  let cloudElement = document.getElementById("cloud");
  cloudElement.append(webGLRenderer.domElement);

  let lightIntensity = 1;
  let ambient = new THREE.AmbientLight(colors.ambientLight, lightIntensity); //свет, освещающий сцену
  scene.add(ambient);
  
  addClouds();
  addLights();
  animate();
  console.log('Time = ', performance.now() - time);
}

function addClouds(){
  let geometry = new THREE.PlaneGeometry(500, 600);
  let texture = THREE.ImageUtils.loadTexture(cloudTexture);
  let material = new THREE.MeshLambertMaterial();
  material.map = texture;
  material.transparent = true;
  cloudsCount = 40;
  clouds = new Array(cloudsCount);
  for (let p = 0; p < cloudsCount; p++) {
    let mesh = new THREE.Mesh(geometry, material);
    let px = Math.random() * 800 - 400; 
    let py = 450;
    let pz = Math.random() * 100 - 150;
    mesh.position.set(px, py, pz);
    mesh.rotation.x = camera.rotation.x;
    mesh.rotation.y = camera.rotation.y;
    mesh.rotation.z = Math.random()*360;
    mesh.material.opacity = 0.5;
    clouds[p] = mesh;
    scene.add(mesh);
  }
}

function addLights(){
  let colors = new Colors();
  let light1 = new THREE.PointLight(colors.light1, 50, 450, 1);
  let px = 200; 
  let py = 300; 
  let pz = 200;
  light1.position.set(px, py, pz);
  scene.add(light1);

  let light2 = new THREE.PointLight(colors.light2, 50, 450, 0.5);
  px = 200; 
  py = 300; 
  pz = 300;
  light2.position.set(px, py, pz);
  scene.add(light2);

  let light3 = new THREE.PointLight(colors.light3, 50, 450, 1.7);
  px = 100; 
  py = 450 
  pz = 100;
  light3.position.set(px, py, pz);
  scene.add(light3);
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
function animate() {
  webGLRenderer.render(scene, camera);
  requestAnimationFrame(animate);
  if (resize()) {
    let domElem = webGLRenderer.domElement;
    camera.aspect = domElem.clientWidth / domElem.clientHeight;
    camera.updateProjectionMatrix();
  }
  for (let i = 0; i < cloudsCount; i++){
    clouds[i].rotation.z -=0.001;
  }
}
