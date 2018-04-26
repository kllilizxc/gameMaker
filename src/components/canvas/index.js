import { mapGetters, mapActions } from 'vuex'
import * as BABYLON from 'babylonjs'
import styles from './style.css'
import EditControl
    from 'exports-loader?org.ssatguru.babylonjs.component.EditControl!imports-loader?BABYLON=babylonjs!babylonjs-editcontrol/dist/EditControl'

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

            if (!scene.activeCamera) {
                this.camera = new BABYLON.UniversalCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene)
                this.camera.setTarget(BABYLON.Vector3.Zero())
                this.camera.attachControl(canvas, true)
                scene.activeCamera = this.camera
            } else {
                this.camera = scene.activeCamera
            }

            // environment
            scene.ambientColor = new BABYLON.Color3(0.51, 0.51, 0.51)

            this.initScene()

            scene.collisionsEnabled = true
            scene.enablePhysics(null, new BABYLON.CannonJSPlugin())
            this.editControl && this.editControl.detach()
            scene.onPointerDown = () => {
                if (this.editControl && this.editControl.isPointerOver()) return
                const pickResult = scene.pick(scene.pointerX, scene.pointerY)
                let pickedGameObject = pickResult.hit && pickResult.pickedMesh && this.scene.getMeshByID(pickResult.pickedMesh.id)
                if (pickedGameObject) pickedGameObject = pickedGameObject.gameObject
                if (pickedGameObject) {
                    this.pickedMesh = pickResult.pickedMesh
                    this.attachEditControl(this.pickedMesh)
                    this.setGameObject(this.pickedMesh.gameObject)
                } else {
                    this.pickedMesh = null
                    this.editControl && this.editControl.hide()
                    this.setGameObject(null)
                }
            }

            engine.runRenderLoop(render)
        },
        isPlaying(val) {
            const { init, scene } = this
            this.detachEditControl()
            if (val) {
                init()
                scene.registerBeforeRender(this.update)
                scene.registerAfterRender(this.lateUpdate)
            } else {
                this.restoreScene()
                scene.unregisterBeforeRender(this.update)
                scene.unregisterAfterRender(this.lateUpdate)
            }
        },
        gameObject(val, oldVal) {
            if (oldVal) {
                oldVal.mesh.showBoundingBox = false
                oldVal.callEvent('onBlur')
            }
            if (!val) this.detachEditControl()
            else {
                this.attachEditControl(val.getMesh())
                val.mesh.showBoundingBox = true
                val.callEvent('onFocus')
            }
        }
    },
    methods: {
        ...mapActions(['addGameObject', 'setGameObject', 'addScript', 'createGameObject', 'restoreScene']),
        attachEditControl(mesh) {
            if (!(mesh.position && mesh.rotation && mesh.scaling)) {
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
            this.createGameObject({ name, scripts: ['lights/pointLight', 'transform'] })
        },
        createDirectionalLight(name = 'directionalLight') {
            this.createGameObject({ name, scripts: ['lights/directionalLight', 'transform', 'lights/shadowGenerator'] })
        },
        createSpotLight(name = 'spotLight') {
            return this.createGameObject({ name, scripts: ['lights/spotLight', 'transform'] })
        },
        createSkyBox(name = 'skyBox') {
            return this.createGameObject({
                name,
                scripts: ['transform', 'geometries/boxGeometry', 'materials/backgroundMaterial', 'skybox']
            })
        },
        createHemisphericLight(name = 'hemisphericLight') {
            return this.createGameObject({ name, scripts: ['lights/hemisphericLight', 'transform'] })
        },
        createUniversalCamera(name = 'universalCamera') {
            return this.createGameObject({ name, scripts: ['cameras/universalCamera', 'transform'] })
        },
        createArcRotateCamera(name = 'arcRotateCamera') {
            return this.createGameObject({ name, scripts: ['cameras/arcRotateCamera', 'transform'] })
        },
        createFollowCamera(name = 'followCamera') {
            return this.createGameObject({ name, scripts: ['cameras/followCamera', 'transform'] })
        },
        createBoxArea(name = 'boxArea') {
            return this.createGameObject({ name, scripts: ['transform', 'boxArea'] })
        },
        animate() {
        },
        init() {
            this.gameObjects.forEach(gameObject => gameObject.callEvent('init'))
        },
        update() {
            this.gameObjects.forEach(gameObject => gameObject.callEvent('update'))
        },
        lateUpdate() {
            this.gameObjects.forEach(gameObject => gameObject.callEvent('lateUpdate'))
        },
        render() {
            const {
                scene, engine, editControl, camera, canvas
            } = this

            engine.resize() // TODO move out of render loop
            if (editControl && editControl.isEditing())
                camera.detachControl(canvas)
            else
                camera.attachControl(canvas)
            scene.getBoundingBoxRenderer().render()
            scene.render()
        }
    },
    mounted() {
        const { canvas } = this

        this.engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true })
        this.$store.dispatch('setCanvas', canvas)
        this.$store.dispatch('setEngine', this.engine)
        this.$store.dispatch('newScene')
    },
    beforeDestory() {
    },
    render() {
        return <canvas class={styles.canvas} ref="canvas"/>
    }
}
