import * as THREE from 'three'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

function createCube() {
  const geometry = new THREE.BoxGeometry()
  const material = new THREE.MeshBasicMaterial({ color: '#FF6347' })
  const cube = new THREE.Mesh(geometry, material)

  cube.position.set(
    Math.random() * 2 - 1,
    Math.random() * 2 - 1,
    Math.random() * 2 - 1
  ) // Рандомно позиционируем кубы

  scene.add(cube)
  return cube
}

camera.position.z = 5

function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}

animate()

/** Добавление нового куба на сцену */
document.getElementById('addObjectBtn').addEventListener('click', () => {
  createCube()
})
