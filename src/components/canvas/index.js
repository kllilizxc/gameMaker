import { mapGetters } from 'vuex'
import * as BABYLON from 'babylonjs'
import styles from './style.css'

export default {
    name: 'draw-canvas',
    data: () => ({
        engine: null,
        camera: null,
        clickPoint: new BABYLON.Vector2(0, 0),
        intersectedMesh: null,
        t: -1
    }),
    computed: {
        ...mapGetters(['scene', 'gameObjects', 'isPlaying']),
        canvas() {
            return this.$refs.canvas
        },
        scripts() {
            const scripts = []
            this.gameObjects.forEach(gameObject =>
                gameObject.scripts && gameObject.scripts.forEach(({ Behavior }) => {
                    scripts.push(new Behavior(BABYLON, gameObject))
                }))
            return scripts
        }
    },
    watch: {
        scene(scene) {
            if (!scene) return
            window.scene = scene
            const { engine, render, onCanvasClick } = this

            this.initScene(scene)
            scene.onPointerDown = onCanvasClick

            engine.runRenderLoop(render)
        },
        isPlaying() {
            const { engine, render, init } = this
            init()
            engine.runRenderLoop(render)
        }
    },
    methods: {
        initScene(scene) {
            const { canvas } = this
            this.camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene)
            this.camera.setTarget(BABYLON.Vector3.Zero())
            this.camera.attachControl(canvas, false)

            const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene)
            BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, scene, false)
        },
        castRay() {
        },
        animate() {
        },
        init() {
            this.scripts.forEach(({ init }) => init && init())
        },
        update() {
            this.scripts.forEach(({ update }) => update && update())
        },
        render() {
            const {
                scene, isPlaying, engine,
                update, animate
            } = this

            engine.resize() // TODO move out of render loop
            if (isPlaying) {
                update()
                animate()
            }
            scene.render()
        },
        onCanvasClick(evt, pickResult) {
            // if the click hits the ground object, we change the impact position
            if (pickResult.hit) {
                this.clickPoint.x = pickResult.pickedPoint.x
                this.clickPoint.y = pickResult.pickedPoint.y

                // set intersectedMesh
            } else {
                this.intersectedMesh = null
            }
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
