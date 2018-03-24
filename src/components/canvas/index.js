import { mapGetters, mapActions } from 'vuex'
import * as BABYLON from 'babylonjs'
import styles from './style.css'
import EditControl from 'exports-loader?org.ssatguru.babylonjs.component.EditControl!imports-loader?BABYLON=babylonjs!babylonjs-editcontrol/dist/EditControl'
import { isLight, isCamera } from '../../common/util'

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

            if (scene.activeCamera) {
                scene.activeCamera.attachControl(canvas)
                this.camera = scene.activeCamera
            } else {
                this.initScene(scene)
            }
            this.editControl && this.editControl.detach()
            scene.onPointerDown = () => {
                if (this.editControl && this.editControl.isPointerOver()) return
                const pickResult = scene.pick(scene.pointerX, scene.pointerY)
                if (pickResult.hit) {
                    this.pickedMesh = pickResult.pickedMesh
                    this.attachEditControl(this.pickedMesh)
                    this.setGameObject(this.pickedMesh)
                } else {
                    this.pickedMesh = null
                    this.editControl && this.editControl.hide()
                    this.setGameObject(null)
                }
            }

            engine.runRenderLoop(render)
        },
        isPlaying() {
            const { engine, render, init } = this
            init()
            engine.runRenderLoop(render)
        },
        gameObject(val) {
            if (!val) return
            this.attachEditControl(val)
        }
    },
    methods: {
        ...mapActions(['addGameObject', 'setGameObject']),
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
        initScene(scene) {
            const { canvas } = this
            this.camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene)
            this.camera.setTarget(BABYLON.Vector3.Zero())
            this.camera.attachControl(canvas, false)
            this.addGameObject(this.camera)

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
        createSphere(name = 'sphere', diameter = 1, diameterX = 1) {
            const sphere = BABYLON.MeshBuilder.CreateSphere(name, { diameter, diameterX }, this.scene)
            // Move the sphere upward 1/2 of its height
            sphere.position.y = 1
            this.addGameObject(sphere)
        },
        createBox(name = 'box', height = 1, width = 1, depth = 1) {
            const box = BABYLON.MeshBuilder.CreateBox(name, { height, width, depth }, this.scene)
            box.position.y = 1
            this.addGameObject(box)
        },
        createPlane(name = 'plane', width = 5, height = 5) {
            this.addGameObject(BABYLON.MeshBuilder.CreatePlane(name, { width, height }, this.scene))
        },
        createGround(name = 'ground', width = 10, height = 10, subdivsions = 4) {
            this.addGameObject(BABYLON.MeshBuilder.CreateGround(name, { width, height, subdivsions }, this.scene))
        },
        createPointLight(name = 'pointLight', x = 1, y = 10, z = 1) {
            this.addGameObject(new BABYLON.PointLight(name, new BABYLON.Vector3(x, y, z), this.scene))
        },
        createDirectionalLight(name = 'directionalLight', x = 0, y = -1, z = 0) {
            this.addGameObject(new BABYLON.DirectionalLight(name, new BABYLON.Vector3(x, y, z), this.scene))
        },
        createSpotLight(name = 'spotLight', px = 0, py = 30, pz = -10, dx = 0, dy = -1, dz = 0, angle = Math.PI / 3, exponent = 2) {
            this.addGameObject(new BABYLON.SpotLight(name, new BABYLON.Vector3(px, py, pz), new BABYLON.Vector3(dx, dy, dz), angle, exponent, this.scene))
        },
        createHemisphericLight(name = 'hemisphericLight', x = 0, y = 1, z = 0) {
            this.addGameObject(new BABYLON.HemisphericLight(name, new BABYLON.Vector3(x, y, z), this.scene))
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
            scene.render()
        }
    },
    mounted() {
        const { canvas } = this

        this.engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true })
        this.$store.dispatch('setEngine', this.engine)
        this.$store.dispatch('setScene', new BABYLON.Scene(this.engine))
    },
    beforeDestory() {
    },
    render() {
        return <canvas class={styles.canvas} ref="canvas"/>
    }
}
