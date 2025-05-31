let container = document.getElementById('container');
let renderer = new THREE.WebGLRenderer();
container.appendChild(renderer.domElement);

let scene = new THREE.Scene();
let camera = new THREE.Camera();
scene.add(camera);

let uniforms = {
  u_time: { type: "f", value: 1.0 },
  u_resolution: { type: "v2", value: new THREE.Vector2() },
  u_mouse: { type: "v2", value: new THREE.Vector2() },
  u_noise: { type: "t", value: null },
  u_buffer: { type: "t", value: null },
  u_renderpass: { type: "b", value: true }
};

let material = new THREE.ShaderMaterial({
  uniforms: uniforms,
  vertexShader: document.getElementById('vertexShader').textContent,
  fragmentShader: document.getElementById('fragmentShader').textContent
});

let mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), material);
scene.add(mesh);

let start = Date.now();
function animate() {
  requestAnimationFrame(animate);
  let time = (Date.now() - start) * 0.001;
  uniforms.u_time.value = time;
  renderer.render(scene, camera);
}
animate();

function onWindowResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  uniforms.u_resolution.value.x = renderer.domElement.width;
  uniforms.u_resolution.value.y = renderer.domElement.height;
}
window.addEventListener('resize', onWindowResize, false);
onWindowResize();

window.addEventListener('mousemove', e => {
  uniforms.u_mouse.value.x = e.pageX / window.innerWidth;
  uniforms.u_mouse.value.y = 1 - e.pageY / window.innerHeight;
});
