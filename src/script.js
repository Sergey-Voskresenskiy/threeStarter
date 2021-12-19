import './style.css';
import {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  Clock,
} from '@three';
import Stats from '@three/examples/jsm/libs/stats.module';
import { OrbitControls } from '@three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui'


class Sketch {
  _time = 0;
  _sizes = {
    width: window.innerWidth,
    height: window.innerHeight
  }
  _windowX = this._sizes.width / 2;
  _windowY = this._sizes.height / 2;
  _cameraSettings = {
    fov:75,
    aspect:this._sizes.width / this._sizes.height,
    near: 0.1,
    far: 100
  }

  constructor(helpers = false) {
    this._helpers = helpers
    this.init()
    this.render()
  }

  init() {
    this.initScene()
    this.initCamera()
    this.initRenderer()


    if (this._helpers) {
      this.initHelpers()
    }
  }

  initScene() {
    this.scene = new Scene()
  }

  initRenderer() {
    this.canvas = document.querySelector('canvas.webgl')

    this.renderer = new WebGLRenderer({
      canvas: this.canvas, alpha: true
    })
    this.renderer.setSize(this._sizes.width, this._sizes.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }

  initCamera() {
    this.camera = new PerspectiveCamera({ ...this._cameraSettings })
    this.camera.position.x = 0
    this.camera.position.y = 0
    this.camera.position.z = 2
    this.scene.add(this.camera)
  }

  initClock() {
    this.clock = new Clock()
    this.elapsed_time = this.clock.getElapsed_time()
  }

  render() {
    if (this._helpers) {
      this.stats.update()
    }

    this._time++

    this.renderer.render(this.scene, this.camera)
    window.requestAnimationFrame(this.render.bind(this))
  }

  initEventListeners() {
    document.addEventListener('mousemove', function (event) {
      this.mouse_X = (event.clientX - this.windowX)
      this.mouse_Y = (event.clientY - this.windowY)
    })
    window.addEventListener('resize', () => {
      // Update _sizes
      this._sizes.width = window.innerWidth
      this._sizes.height = window.innerHeight
      // Update camera
      this.camera.aspect = this._sizes.width / this._sizes.height
      this.camera.updateProjectionMatrix()
      // Update renderer
      this.renderer.setSize(this._sizes.width, this._sizes.height)
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })
  }

  // helpers
  initHelpers() {
    this.stats = Stats()
    document.body.appendChild(this.stats.dom)

    this.controls = new OrbitControls(this.camera, this.canvas)
    this.controls.enableDamping = true
  }

  /**
   * @description exsample:`this.createGUIhelper('pointLight', {...pointLight.position})`
   * @param {*} name Name group in gui
   * @param {*} property Destructure the object of the properties you need
   */
  createGUIhelper(name, property) {
    this.gui = new dat.GUI()
    const newHelper = this.gui.addFolder(`${name}`)
    for (let key in property) {
      newHelper.add(property, key)
    }
  }

}

new Sketch(true)
