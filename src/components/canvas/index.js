import { mapGetters, mapActions } from 'vuex'
import * as BABYLON from 'babylonjs'
import styles from './style.css'
import EditControl from 'exports-loader?org.ssatguru.babylonjs.component.EditControl!imports-loader?BABYLON=babylonjs!babylonjs-editcontrol/dist/EditControl'
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

            scene.clearColor = new BABYLON.Color4(0.02, 0.02, 0.02, 1.0)
            scene.imageProcessingConfiguration.contrast = 1.6
            scene.imageProcessingConfiguration.exposure = 0.6
            scene.imageProcessingConfiguration.toneMappingEnabled = true

            this.camera = new BABYLON.UniversalCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene)
            this.camera.setTarget(BABYLON.Vector3.Zero())
            this.camera.attachControl(canvas, true)
            scene.activeCamera = this.camera

            scene.activeCamera.lowerRadiusLimit = 20
            scene.activeCamera.upperRadiusLimit = 80
            scene.activeCamera.alpha = 2.5
            scene.activeCamera.beta = 1.5
            scene.activeCamera.useAutoRotationBehavior = true

            scene.createDefaultEnvironment({ groundShadowLevel: 0.2 })
                .setMainColor(new BABYLON.Color3(0.42, 0.41, 0.33))

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
            if (val) {
                init()
            } else {
                this.restoreScene()
            }
        },
        gameObject(val) {
            if (!val) return
            this.attachEditControl(val.getMesh())
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
        },
        initScene() {
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
        createPointLight(name = 'pointLight') {
            this.createGameObject({ name, script: 'lights/pointLight' })
        },
        createDirectionalLight(name = 'directionalLight') {
            this.createGameObject({ name, script: 'lights/directionalLight' })
        },
        createSpotLight(name = 'spotLight', px = 0, py = 30, pz = -10, dx = 0, dy = -1, dz = 0, angle = Math.PI / 3, exponent = 2) {
            const spotLight = new BABYLON.SpotLight(name, new BABYLON.Vector3(px, py, pz), new BABYLON.Vector3(dx, dy, dz), angle, exponent, this.scene)
            this.addGameObject(new GameObject(name, spotLight))
        },
        createHemisphericLight(name = 'hemisphericLight') {
            this.createGameObject({ name, script: 'lights/hemisphericLight' })
        },
        createUniversalCamera(name = 'universalCamera') {
            this.createGameObject({ name, script: 'universalCamera' })
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
        this.$store.dispatch('newScene').then(this.initScene)
    },
    beforeDestory() {
    },
    render() {
        return <canvas class={styles.canvas} ref="canvas"/>
    }
}
