import styles from './style.css'
import { mapGetters } from 'vuex'

export default {
    name: 'draw-canvas',
    data: () => ({
        camera: null,
        mixer: null,
        orbitControls: null,
        transformControls: null,
        renderer: new THREE.WebGLRenderer({ antialias: true }),
        clock: new THREE.Clock(),
        raycaster: new THREE.Raycaster(),
        clickPoint: new THREE.Vector2(),
        intersected: null,
        t: -1
    }),
    computed: {
        ...mapGetters(['scene', 'gameObjects', 'isPlaying']),
        container() {
            return this.$refs.container
        },
        scripts() {
            const scripts = []
            this.gameObjects.forEach(gameObject =>
                gameObject.scripts && gameObject.scripts.forEach(({ Behavior }) => {
                    scripts.push(new Behavior(THREE, gameObject))
                }))
            return scripts
        }
    },
    watch: {
        scene(val) {
            if (!val) return
            const scene = val
            window.scene = scene

            if (!scene.children || scene.children.length === 0)
                this.initScene(scene)
            else
                scene.traverse(sceneChild => {
                    if (sceneChild.type === 'PerspectiveCamera') {
                        this.camera = sceneChild
                    }
                })

            if (scene.animations) {
                const animationClip = scene.animations[0]
                this.mixer = new THREE.AnimationMixer(scene)
                this.mixer.clipAction(animationClip).play()
            }

            this.orbitControls = new THREE.OrbitControls(this.camera, this.renderer.domElement)
            this.transformControls = new THREE.TransformControls(this.camera, this.renderer.domElement)
            this.transformControls.addEventListener('mouseDown', this.disableOrbitControls)
            this.transformControls.addEventListener('mouseUp', this.enableOrbitControls)

            this.resizeCanvasToDisplaySize(true)
            window.cancelAnimationFrame(this.t)
            this.t = window.requestAnimationFrame(this.render)
        },
        isPlaying() {
            this.clock.start()
            this.init()
            window.cancelAnimationFrame(this.t)
            this.t = window.requestAnimationFrame(this.render)
        }
    },
    methods: {
        initScene(scene) {
            // background
            scene.background = new THREE.Color(0xffffff)
            // camera
            this.camera = new THREE.PerspectiveCamera(30, 1, 1, 10000)
            this.camera.position.set(-200, 0, 200)
            this.camera.name = 'camera'
            scene.add(this.camera)
            // ambient light
            const ambientLight = new THREE.AmbientLight(0x404040)
            ambientLight.name = 'ambientLight'
            scene.add(ambientLight)
            // point lights
            const pointLight1 = new THREE.PointLight(0xffffff, 0.6)
            pointLight1.position.set(-22, 52, -28)
            pointLight1.name = 'pointLight1'
            scene.add(pointLight1)
            const pointLight2 = new THREE.PointLight(0xffffff, 0.8)
            pointLight2.position.set(18, 34, 80)
            pointLight2.name = 'pointLight2'
            scene.add(pointLight2)
            // ground plane
            const geometry = new THREE.PlaneBufferGeometry(20000, 20000)
            const material = new THREE.MeshPhongMaterial({ shininess: 0.1 })
            const ground = new THREE.Mesh(geometry, material)

            ground.position.set(0, -250, 0)
            ground.rotation.x = -Math.PI / 2
            ground.name = 'ground'
            scene.add(ground)
            // fog
            scene.fog = new THREE.Fog(0xffffff, 1000, 10000)
        },
        castRay() {
            const { raycaster, camera, scene, clickPoint } = this
            raycaster.setFromCamera(clickPoint, camera)
            const intersects = raycaster.intersectObjects(scene.children)
            if (intersects.length > 0)
                this.intersected = intersects[0].object
            else
                this.intersected = null
        },
        resizeCanvasToDisplaySize(force = false) {
            const { renderer, camera } = this
            const canvas = renderer.domElement
            // look up the size the canvas is being displayed
            const width = canvas.clientWidth
            const height = canvas.clientHeight
            const size = renderer.getSize()

            // adjust displayBuffer size to match
            if (force || size.width !== width || size.height !== height) {
                // you must pass false here or three.js sadly fights the browser
                renderer.setSize(width, height, false)
                camera.aspect = width / height
                camera.updateProjectionMatrix()
            }
        },
        animate() {
            const { clock, mixer } = this
            if (!mixer) return
            const delta = clock.getDelta()
            mixer.update(delta)
        },
        init() {
            this.scripts.forEach(({ init }) => init && init())
        },
        update() {
            this.scripts.forEach(({ update }) => update && update())
        },
        render() {
            const {
                renderer, scene, camera, isPlaying,
                resizeCanvasToDisplaySize, update, animate, render
            } = this

            resizeCanvasToDisplaySize()
            if (isPlaying) {
                update()
                animate()
            }
            renderer.render(scene, camera)
            this.t = window.requestAnimationFrame(render)
        },
        onCanvasClick(e) {
            const { renderer, intersected, scene, transformControls } = this
            const canvas = renderer.domElement
            e.preventDefault()
            this.clickPoint.x = (event.clientX / canvas.clientWidth) * 2 - 1
            this.clickPoint.y = -(event.clientY / canvas.clientHeight) * 2 + 1
            this.castRay()
            if (intersected) {
                transformControls.attach(intersected)
                scene.add(transformControls)
                this.$store.dispatch('setGameObject', intersected)
            }
        },
        enableOrbitControls() {
            this.orbitControls.enabled = true
        },
        disableOrbitControls() {
            this.orbitControls.enabled = false
        }
    },
    created() {
        this.$store.dispatch('setScene', new THREE.Scene())
    },
    mounted() {
        const { container, renderer, onCanvasClick } = this
        const canvas = renderer.domElement

        renderer.setPixelRatio(window.devicePixelRatio)
        container.appendChild(canvas)

        canvas.addEventListener('click', onCanvasClick, false)
    },
    beforeDestory() {
        const {
            renderer, transformControls,
            onCanvasClick, enableOrbitControls, diableOrbitControls
        } = this
        renderer.domElement.removeEventListener('click', onCanvasClick)
        if (transformControls) {
            transformControls.removeEventListener('mouseDown', diableOrbitControls)
            transformControls.removeEventListener('mouseUp', enableOrbitControls)
        }
    },
    render() {
        return <div class={styles.container} ref="container"/>
    }
}

