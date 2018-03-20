import { mapGetters, mapActions } from 'vuex'
import * as BABYLON from 'babylonjs'
import styles from './style.css'
import EditControl from 'exports-loader?org.ssatguru.babylonjs.component.EditControl!imports-loader?BABYLON=babylonjs!babylonjs-editcontrol/dist/EditControl'

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
            const { engine, render } = this

            this.initScene(scene)
            scene.onPointerDown = () => {
                if (this.editControl && this.editControl.isPointerOver()) return
                const pickResult = scene.pick(scene.pointerX, scene.pointerY)
                if (pickResult.hit) {
                    this.pickedMesh = pickResult.pickedMesh
                    if (!this.editControl) {
                        this.editControl = new EditControl(this.pickedMesh, this.camera, this.canvas, 1, true)
                        this.editControl.enableTranslation()
                    } else {
                        this.editControl.show()
                        this.editControl.switchTo(this.pickedMesh)
                    }
                    this.setGameObject(this.pickedMesh)
                } else {
                    this.pickedMesh = null
                    this.editControl && this.editControl.hide()
                }
            }

            engine.runRenderLoop(render)
        },
        isPlaying() {
            const { engine, render, init } = this
            init()
            engine.runRenderLoop(render)
        }
    },
    methods: {
        ...mapActions(['addGameObject', 'setGameObject']),
        initScene(scene) {
            const { canvas } = this
            this.camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene)
            this.camera.setTarget(BABYLON.Vector3.Zero())
            this.camera.attachControl(canvas, false)

            const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene)
            const ground = BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, scene, false)
            this.addGameObject([this.camera, light, ground])
        },
        newSphere(name = 'sphere1') {
            const sphere = BABYLON.Mesh.CreateSphere(name, 16, 2, this.scene, false, BABYLON.Mesh.FRONTSIDE)
            // Move the sphere upward 1/2 of its height
            sphere.position.y = 1
            this.addGameObject(sphere)
        },
        animate() {
        },
        init() {
            this.gameObject.scripts.forEach(({ init }) => init && init.bind(this.gameObject)())
        },
        update() {
            this.gameObject.scripts.forEach(({ update }) => update && update.bind(this.gameObject)())
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

        this.engine = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true})
        this.$store.dispatch('setScene', new BABYLON.Scene(this.engine))
    },
    beforeDestory() {
    },
    render() {
        return <canvas class={styles.canvas} ref="canvas"/>
    }
}
