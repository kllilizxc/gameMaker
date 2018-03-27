import { mapGetters, mapActions } from 'vuex'
import * as BABYLON from 'babylonjs'
import styles from './style.css'
import EditControl from 'exports-loader?org.ssatguru.babylonjs.component.EditControl!imports-loader?BABYLON=babylonjs!babylonjs-editcontrol/dist/EditControl'
import { isLight, isCamera } from '../../common/util'
import GameObject from '../../classes/gameObject'
import { readDefaultScript } from '../../store/scene'

export default {
    name: 'draw-canvas',
    data: () => ({
        engine: null,
        camera: null,
        pickedMesh: null,
        editControl: null,
        innerMeshes: null,
        t: -1
    }),
    computed: {
        ...mapGetters(['scene', 'gameObjects', 'isPlaying', 'gameObject']),
        canvas() {
            return this.$refs.canvas
        }
    },
    watch: {
        scene(scene) {
            if (!scene) return
            window.scene = scene
            const { engine, render, canvas } = this

            this.camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene)
            this.camera.setTarget(BABYLON.Vector3.Zero())
            this.camera.attachControl(canvas, false)
            scene.activeCamera = this.camera

            scene.collisionsEnabled = true
            scene.enablePhysics(null, new BABYLON.CannonJSPlugin())
            this.editControl && this.editControl.detach()
            scene.onPointerDown = () => {
                if (this.editControl && this.editControl.isPointerOver()) return
                const pickResult = scene.pick(scene.pointerX, scene.pointerY)
                this.pickedMesh && (this.pickedMesh.showBoundingBox = false)
                if (pickResult.hit) {
                    this.pickedMesh = pickResult.pickedMesh
                    this.attachEditControl(this.pickedMesh)
                    this.setGameObject(this.pickedMesh.gameObject)
                    this.pickedMesh.showBoundingBox = true
                } else {
                    this.pickedMesh = null
                    this.editControl && this.editControl.hide()
                    this.setGameObject(null)
                }
            }

            engine.runRenderLoop(render)
        },
        isPlaying(val) {
            const { engine, render, init } = this
            if (!val) return
            init()
            engine.runRenderLoop(render)
        },
        gameObject(val) {
            if (!val) return
            this.attachEditControl(val.getMesh())
        }
    },
    methods: {
        ...mapActions(['addGameObject', 'setGameObject', 'addScript', 'createGameObject']),
        attachEditControl(mesh) {
            if (!(mesh.position && mesh.rotation && mesh.scaling) || isLight(mesh) || isCamera(mesh)) {
                this.editControl && this.editControl.hide()
                return
            }
            if (!this.editControl) {
                this.editControl = new EditControl(mesh, this.camera, this.canvas, 1, true)
                this.editControl.enableTranslation()
            } else {
                this.editControl.show()
                this.editControl.switchTo(mesh)
            }
        },
        detachEditControl() {
            this.editControl && this.editControl.detach()
        },
        initScene() {
            this.createHemisphericLight('light1', 0, 1, 0)
            this.createGround('ground1')
        },
        dispose() {
            this.editControl = null
            this.scene.dispose()
        },
        enableTranslation() {
            const { editControl } = this
            if (!editControl) return
            editControl.enableTranslation()
            editControl.disableRotation()
            editControl.disableScaling()
        },
        enableRotation() {
            const { editControl } = this
            if (!editControl) return
            editControl.disableTranslation()
            editControl.enableRotation()
            editControl.disableScaling()
        },
        enableScaling() {
            const { editControl } = this
            if (!editControl) return
            editControl.disableTranslation()
            editControl.disableRotation()
            editControl.enableScaling()
        },
        createEmptyMesh(name = 'mesh') {
            this.createGameObject({ name })
        },
        createSphere(name = 'sphere', diameter = 1, diameterX = 1) {
            const sphere = BABYLON.MeshBuilder.CreateSphere(name, { diameter, diameterX }, this.scene)
            // Move the sphere upward 1/2 of its height
            sphere.position.y = 1
            this.addGameObject(new GameObject(name, sphere))
        },
        createBox(name = 'box') {
            this.createGameObject({ name, script: 'geometries/boxGeometry' })
        },
        createPlane(name = 'plane', width = 5, height = 5) {
            const plane = new GameObject(name, BABYLON.MeshBuilder.CreatePlane(name, { width, height }, this.scene))
            this.addGameObject(plane)
        },
        createGround(name = 'ground', width = 10, height = 10, subdivsions = 4) {
            const ground = new GameObject(name, BABYLON.MeshBuilder.CreateGround(name, { width, height, subdivsions }, this.scene))
            this.addGameObject(ground)
        },
        createPointLight(name = 'pointLight', x = 1, y = 10, z = 1) {
            const pointLight = new BABYLON.PointLight(name, new BABYLON.Vector3(x, y, z), this.scene)
            this.addGameObject(new GameObject(name, pointLight))
        },
        createDirectionalLight(name = 'directionalLight', x = 0, y = -1, z = 0) {
            const directionalLight = new BABYLON.DirectionalLight(name, new BABYLON.Vector3(x, y, z), this.scene)
            this.addGameObject(new GameObject(name, directionalLight))
        },
        createSpotLight(name = 'spotLight', px = 0, py = 30, pz = -10, dx = 0, dy = -1, dz = 0, angle = Math.PI / 3, exponent = 2) {
            const spotLight = new BABYLON.SpotLight(name, new BABYLON.Vector3(px, py, pz), new BABYLON.Vector3(dx, dy, dz), angle, exponent, this.scene)
            this.addGameObject(new GameObject(name, spotLight))
        },
        createHemisphericLight(name = 'hemisphericLight', x = 0, y = 1, z = 0) {
            const hemisphericLight = new BABYLON.HemisphericLight(name, new BABYLON.Vector3(x, y, z), this.scene)
            this.addGameObject(new GameObject(name, hemisphericLight))
        },
        animate() {
        },
        init() {
            this.gameObjects.forEach(gameObject =>
                gameObject.scripts && gameObject.scripts.forEach(({ init }) => init && init.bind(gameObject)()))
        },
        update() {
            this.gameObjects.forEach(gameObject =>
                gameObject.scripts && gameObject.scripts.forEach(({ update }) => update && update.bind(gameObject)()))
        },
        render() {
            const {
                scene, isPlaying, engine, editControl, camera, canvas,
                update, animate
            } = this

            engine.resize() // TODO move out of render loop
            if (editControl && editControl.isEditing())
                camera.detachControl(canvas)
            else
                camera.attachControl(canvas)
            if (isPlaying) {
                update()
                animate()
            }
            scene.getBoundingBoxRenderer().render()
            scene.render()
        }
    },
    mounted() {
        const { canvas } = this

        this.engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true })
        this.$store.dispatch('setEngine', this.engine)
        this.$store.dispatch('newScene').then(this.initScene)
    },
    beforeDestory() {
    },
    render() {
        return <canvas class={styles.canvas} ref="canvas"/>
    }
}
