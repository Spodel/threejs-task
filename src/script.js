import * as THREE from 'three'
import { DragControls } from 'three/examples/jsm/controls/DragControls.js'
import './styles.css'

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
const roomSize = 4

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

// Создание помещения для кубов
function createRoom() {
  const roomGeometry = new THREE.BoxGeometry(
    roomSize * 2,
    roomSize * 2,
    roomSize * 2
  )
  const roomMaterial = new THREE.MeshBasicMaterial({
    color: '#4682B4',
    wireframe: true,
  })
  const room = new THREE.Mesh(roomGeometry, roomMaterial)
  scene.add(room)
}

camera.position.z = 10

/** Настройка перемещения кубов */

// Контроллер для перемещения по осям
const controls = new DragControls(cubes, camera, renderer.domElement)
let selectedAxis = 'none'

// Ограничиваем перемещение по выбранной оси
controls.addEventListener('drag', function (event) {
  if (event.object) {
    let { x, y, z } = event.object.position

    // Ограничиваем перемещение за пределы помещения
    if (x > roomSize) x = roomSize
    if (x < -roomSize) x = -roomSize
    if (y > roomSize) y = roomSize
    if (y < -roomSize) y = -roomSize
    if (z > roomSize) z = roomSize
    if (z < -roomSize) z = -roomSize

    // Обновляем позицию объекта с учетом ограничений
    event.object.position.set(x, y, z)
    if (selectedAxis === 'x') {
      event.object.position.x = 0 // не получилось сделать, чтоб бралось текущее значение :( поэтому 0
    } else if (selectedAxis === 'y') {
      event.object.position.y = 0
    } else if (selectedAxis === 'z') {
      event.object.position.z = 0
    }
  }
})

createRoom()

// Притягивание кубов к граням
function snapCubeToEdge(cube, edge) {
  if (cube) {
    switch (edge) {
      case 'front':
        cube.position.z = roomSize
        break
      case 'back':
        cube.position.z = -roomSize
        break
      case 'left':
        cube.position.x = -roomSize
        break
      case 'right':
        cube.position.x = roomSize
        break
      case 'top':
        cube.position.y = roomSize
        break
      case 'bottom':
        cube.position.y = -roomSize
        break
      default:
        break
    }
  }
}

// Определение клика
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()
let selectedCube = null

function onClick(event) {
  // Преобразуем координаты клика
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

  raycaster.setFromCamera(mouse, camera)

  const intersects = raycaster.intersectObjects(cubes)

  if (intersects.length > 0) {
    selectedCube = intersects[0].object // Выбираем первый объект, с которым пересекается луч
  }
}

window.addEventListener('click', onClick, false)

/** Обработчики событий для кнопок */

// Обработчик добавления объекта
document.getElementById('addObjectBtn').addEventListener('click', () => {
  createCube()
})

// Обработчик выбора оси для ограничения перемещения
document.getElementById('axisSelect').addEventListener('change', (event) => {
  selectedAxis = event.target.value
})

// Обработчики притягивания кубов к граням
document.getElementById('toFront').addEventListener('click', () => {
  cubes.forEach((cube) => snapCubeToEdge(cube, 'front'))
})
document.getElementById('toBack').addEventListener('click', () => {
  cubes.forEach((cube) => snapCubeToEdge(cube, 'back'))
})
document.getElementById('toLeft').addEventListener('click', () => {
  cubes.forEach((cube) => snapCubeToEdge(cube, 'left'))
})
document.getElementById('toRight').addEventListener('click', () => {
  cubes.forEach((cube) => snapCubeToEdge(cube, 'right'))
})
document.getElementById('toTop').addEventListener('click', () => {
  cubes.forEach((cube) => snapCubeToEdge(cube, 'top'))
})
document.getElementById('toBottom').addEventListener('click', () => {
  cubes.forEach((cube) => snapCubeToEdge(cube, 'bottom'))
})

function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}
animate()
