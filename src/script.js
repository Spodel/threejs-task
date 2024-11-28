import * as THREE from 'three'
import { DragControls } from 'three/examples/jsm/controls/DragControls.js'

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

const cubes = []

// Создание нового куба
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
  cubes.push(cube)
  return cube
}

camera.position.z = 5

/* Настройка перемещения кубов */

const controls = new DragControls(cubes, camera, renderer.domElement) // Контроллер для перемещения по осям

let selectedAxis = 'none'

// Обработчик выбора оси для ограничения перемещения
document.getElementById('axisSelect').addEventListener('change', (event) => {
  selectedAxis = event.target.value
})

// Ограничиваем перемещение по выбранной оси
controls.addEventListener('drag', function (event) {
  if (event.object) {
    if (selectedAxis === 'x') {
      event.object.position.x = 0 // не получилось сделать, чтоб бралось текущее значение :( поэтому 0
    } else if (selectedAxis === 'y') {
      event.object.position.y = 0
    } else if (selectedAxis === 'z') {
      event.object.position.z = 0
    }
  }
})

// Обработчик добавления нового куба на сцену
document.getElementById('addObjectBtn').addEventListener('click', () => {
  createCube()
})

function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}
animate()
