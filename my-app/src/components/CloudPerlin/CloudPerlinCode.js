let permutationTable;

export default function init() {
  let time = performance.now();
  let width = 1024;
  let height = 768;
  let cloudElement = document.getElementById("cloudP");
  let canvasContext = document.createElement('canvas').getContext('2d');
  cloudElement.append(canvasContext.canvas);
  canvasContext.canvas.width = width;
  canvasContext.canvas.height = height;
  
  let cloudImage = canvasContext.createImageData(width, height);
  let cloud = cloudImage.data;
  initPermut();
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let octaves = 12;
      let persistence = 0.5;
      let value = Math.abs(perlinFS(x / 25, y / 25, octaves, persistence)) * 255;
      let index = (x + y * width) * 4;
      cloud[index] = value;
      cloud[index + 1] = value;
      cloud[index + 2] = value + Math.max(0, -value);
      cloud[index + 3] = 90;
    }
  }
  canvasContext.putImageData(cloudImage, 0, 0);
  console.log('Time = ', performance.now() - time);
}

function Grad(x, y) {
  this.x = x; 
  this.y = y;
}

Grad.prototype.dot = function(x, y) {
  return this.x*x + this.y*y;
};
function initPermut() {
  permutationTable = new Array(1024);
  // gradVect = new Array(512);
  // pseudoRandomV = new Array(512)
  for (let i = 0; i < 1024; i++) {
    permutationTable[i] = Math.random() * 100;
  }
  // for (let i = 0; i < 1024 / 4; i++) {
  //   let v;
  //   v = permutationTable[i] ^ 0;
  //   gradVect[i] = gradVect[i + 256] = v;
  //   if (v % 4 === 0){
  //     pseudoRandomV[i] = new Grad(0,-1);
  //     pseudoRandomV[i + 256] = new Grad(0,-1);
  //   } else if (v % 4 === 1){
  //     pseudoRandomV[i] = new Grad(1,0);
  //     pseudoRandomV[i + 256] = new Grad(1,0);
  //   } else if (v % 4 === 2) {
  //     pseudoRandomV[i] = new Grad(-1,0);
  //     pseudoRandomV[i + 256] = new Grad(-1,0);
  //   } else if ( v % 4 === 3) {
  //     pseudoRandomV[i] = new Grad(0,1);
  //     pseudoRandomV[i + 256] = new Grad(0,1);
  //   }
  // }
};

function fade(t) {
  return t*t*t*(t*(t*6-15)+10);
}

function interpolate(a, b, x) {
  let fx = x * Math.PI;
  let f = (1 - Math.cos(fx)) * 0.5;
  let result = a*(1-f) + b*f; ;
  return result;
}
function getPseudoRandomV(x, y){
  let v = ((x * 1836311903) ^ (y * 2971215073) + 4807526976) & 1023;
  v = permutationTable[v] & 3;

  switch (v) {
    case 0: return new Grad(1, 0);
    case 1: return new Grad(-1, 0);
    case 2: return new Grad(0, 1);
    default: return new Grad(0, -1);
  }
}

function perlin(x, y) {
  let X = Math.floor(x), Y = Math.floor(y);
  x = x - X; y = y - Y;
  X = X & 255; Y = Y & 255;

  // Calculate noise contributions from each of the four corners
  // t2 . t4
  //  .    .
  // t1 . t3
  // let t1Gradient = pseudoRandomV[X+gradVect[Y]];      
  // let t2Gradient = pseudoRandomV[X+gradVect[Y+1]];
  // let t3Gradient = pseudoRandomV[X+1+gradVect[Y]];
  // let t4Gradient = pseudoRandomV[X+1+gradVect[Y+1]]; 

  let t1Gradient = getPseudoRandomV(X, Y);      
  let t2Gradient = getPseudoRandomV(X, Y+1);
  let t3Gradient = getPseudoRandomV(X+1, Y);
  let t4Gradient = getPseudoRandomV(X+1, Y+1); 

  var t1 = t1Gradient.dot(x, y);
  var t2 = t2Gradient.dot(x, y-1);
  var t3 = t3Gradient.dot(x-1, y);
  var t4 = t4Gradient.dot(x-1, y-1);

  let u = fade(x);
  let v = fade(y);
  return interpolate(interpolate(t1, t3, u), interpolate(t2, t4, u), v);
}; 

function perlinFS(x, y, octaves, persistence) {
  let ampl = 1, result = 0, freq = 0.10;
  let layers = octaves;
  for (;octaves > 0; octaves--){
    result += perlin(x * freq, y * freq) * ampl;
    ampl *= persistence;
    freq *= 2;
  }
  result *= (1 << layers) / ((1 << layers) - 1);
  return result * 0.5 + 0.5;
};
