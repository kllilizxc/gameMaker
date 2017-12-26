import styles from './style.css'
import THREELib from 'three-js'

const THREE = THREELib(['OrbitControls'])

export default {
    name: 'canvas',
    props: {
        scene: Object
    },
    data: () => ({
        _scene: null,
        camera: null,
        mixer: null,
        controls: null,
        renderer: new THREE.WebGLRenderer({ antialias: true }),
        clock: new THREE.Clock(),
        t: -1
    }),
    computed: {
        container() {
            return this.$refs.container
        },
        screenWidth() {
            return this.container.clientWidth
        },
        screenHeight() {
            return this.container.clientHeight
        },
        screenRatio() {
            return this.screenWidth / this.screenHeight
        }
    },
    watch: {
        scene: {
            handler(scene) {
                if (!scene) return
                scene.background = new THREE.Color(0xffffff)

                scene.traverse(sceneChild => {
                    if (sceneChild.type === 'PerspectiveCamera') {
                        this.camera = sceneChild
                        this.resetCameraSize()
                    }
                })

                if (!this.camera) {
                    this.camera = new THREE.PerspectiveCamera(30, this.screenRatio, 1, 1000)
                    this.camera.position.set(-200, 0, 200)
                }

                this.controls = new THREE.OrbitControls(this.camera)

                const geometry = new THREE.PlaneBufferGeometry(20000, 20000)
                const material = new THREE.MeshPhongMaterial({ shininess: 0.1 })
                const ground = new THREE.Mesh(geometry, material)

                ground.position.set(0, -250, 0)
                ground.rotation.x = -Math.PI / 2

                scene.add(ground)
                scene.fog = new THREE.Fog(0xffffff, 1000, 10000)

                const animationClip = scene.animations[0]
                this.mixer = new THREE.AnimationMixer(scene)
                this.mixer.clipAction(animationClip).play()

                this._scene = scene

                window.cancelAnimationFrame(this.t)
                this.animate()
            },
            immediate: true
        }
    },
    methods: {
        resetCameraSize() {
            this.camera.aspect = this.screenWidth / this.screenHeight
            this.camera.updateProjectionMatrix()
        },
        animate() {
            this.t = requestAnimationFrame(this.animate)
            this.render()
        },
        render() {
            const { clock, mixer, renderer, camera } = this
            const delta = 0.75 * clock.getDelta()
            mixer.update(delta)
            renderer.render(this._scene, camera)
        }
    },
    mounted() {
        const { container, renderer, screenWidth, screenHeight } = this

        renderer.setSize(screenWidth, screenHeight)
        renderer.setPixelRatio(window.devicePixelRatio)
        container.appendChild(renderer.domElement)

        container.onresize = () => {
            this.resetCameraSize()
        }
    },
    render() {
        return <div class={styles.container} ref="container"/>
    }
}
