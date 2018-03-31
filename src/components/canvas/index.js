import { mapGetters, mapActions } from 'vuex'
import * as BABYLON from 'babylonjs'
import styles from './style.css'
import EditControl
    from 'exports-loader?org.ssatguru.babylonjs.component.EditControl!imports-loader?BABYLON=babylonjs!babylonjs-editcontrol/dist/EditControl'
import { isLight, isCamera } from '../../common/util'
import GameObject from '../../classes/gameObject'

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

            scene.clearColor = new BABYLON.Color4(0.41, 0.44, 0.42, 0.6)

            this.camera = new BABYLON.UniversalCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene)
            this.camera.setTarget(BABYLON.Vector3.Zero())
            this.camera.attachControl(canvas, true)
            scene.activeCamera = this.camera

            this.initScene()

            const options = new BABYLON.SceneOptimizerOptions(50, 2000)
            options.addOptimization(new BABYLON.HardwareScalingOptimization(0, 1))

            // Optimizer
            const optimizer = new BABYLON.SceneOptimizer(scene, options)
            optimizer.start()

            scene.collisionsEnabled = true
            scene.enablePhysics(null, new BABYLON.CannonJSPlugin())
            this.editControl && this.editControl.detach()
            scene.onPointerDown = () => {
                if (this.editControl && this.editControl.isPointerOver()) return
                const pickResult = scene.pick(scene.pointerX, scene.pointerY)
                this.pickedMesh && (this.pickedMesh.showBoundingBox = false)
                if (pickResult.hit && this.gameObjects.find(({ mesh }) => mesh === pickResult.pickedMesh)) {
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
            const { init } = this
            this.detachEditControl()
            if (val) {
                init()
            } else {
                this.restoreScene()
            }
        },
        gameObject(val) {
            if (!val) this.detachEditControl()
            else this.attachEditControl(val.getMesh())
        }
    },
    methods: {
        ...mapActions(['addGameObject', 'setGameObject', 'addScript', 'createGameObject', 'restoreScene']),
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
            this.editControl = null
        },
        initScene() {
        },
        dispose() {
            this.detachEditControl()
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
            return this.createGameObject({ name, scripts: ['transform'] })
        },
        createSphere(name = 'sphere') {
            return this.createGameObject({ name, scripts: ['transform', 'geometries/sphereGeometry'] })
        },
        createBox(name = 'box') {
            return this.createGameObject({ name, scripts: ['transform', 'geometries/boxGeometry'] })
        },
        createPlane(name = 'plane') {
            return this.createGameObject({ name, scripts: ['transform', 'geometries/planeGeometry'] })
        },
        createGround(name = 'ground') {
            return this.createGameObject({ name, scripts: ['transform', 'geometries/groundGeometry'] })
        },
        createPointLight(name = 'pointLight') {
            this.createGameObject({ name, scripts: ['transform', 'lights/pointLight'] })
        },
        createDirectionalLight(name = 'directionalLight') {
            this.createGameObject({ name, scripts: ['transform', 'lights/directionalLight'] })
        },
        createSpotLight(name = 'spotLight') {
            return this.createGameObject({ name, scripts: ['transform', 'lights/spotLight'] })
        },
        createSkyBox(name = 'skyBox') {
            return this.createGameObject({ name, scripts: ['transform', 'geometries/boxGeometry', 'materials/backgroundMaterial', 'skybox'] })
        },
        createHemisphericLight(name = 'hemisphericLight') {
            return this.createGameObject({ name, scripts: ['transform', 'lights/hemisphericLight'] })
        },
        createUniversalCamera(name = 'universalCamera') {
            return this.createGameObject({ name, scripts: ['transform', 'cameras/universalCamera'] })
        },
        createArcRotateCamera(name = 'arcRotateCamera') {
            return this.createGameObject({ name, scripts: ['transform', 'cameras/arcRotateCamera'] })
        },
        createBoxArea(name = 'boxArea') {
            return this.createGameObject({ name, scripts: ['transform', 'boxArea'] })
        },
        animate() {
        },
        init() {
            this.gameObjects.forEach(gameObject => {
                const { scripts } = gameObject
                scripts && Object.keys(scripts).map(key => scripts[key]).forEach(({ init }) => init && init.bind(gameObject)())
            })
        },
        update() {
            this.gameObjects.forEach(gameObject => {
                const { scripts } = gameObject
                scripts && Object.keys(scripts).map(key => scripts[key]).forEach(({ update }) => update && update.bind(gameObject)())
            })
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
        this.$store.dispatch('setCanvas', canvas)
        this.$store.dispatch('setEngine', this.engine)
        this.$store.dispatch('openScene', 'static/scenes/default.scene')
    },
    beforeDestory() {
    },
    render() {
        return <canvas class={styles.canvas} ref="canvas"/>
    }
}
