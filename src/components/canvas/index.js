import styles from './style.css'
import THREELib from 'three-js'
const THREE = THREELib(['OrbitControls'])

export default {
    name: 'canvas',
    data: () => ({

    }),
    mounted() {
        let { container } = this.$refs
        let scene, camera, controls, mixer
        let clock = new THREE.Clock()
        let renderer = new THREE.WebGLRenderer({ antialias: true })
        let SCREEN_WIDTH = container.clientWidth
        let SCREEN_HEIGHT = container.clientHeight

        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT)
        renderer.setPixelRatio(window.devicePixelRatio)
        container.appendChild(renderer.domElement)

        new THREE.ObjectLoader().load('static/scenes/scene-animation.json', loadedScene => {
            scene = loadedScene
            scene.background = new THREE.Color(0xffffff)

            scene.traverse(sceneChild => {
                if (sceneChild.type === 'PerspectiveCamera') {
                    camera = sceneChild
                    resetCameraSize(camera)
                }
            })

            if (!camera) {
                camera = new THREE.PerspectiveCamera(30, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 1000)
                camera.position.set(-200, 0, 200)
            }

            controls = new THREE.OrbitControls(camera)

            let geometry = new THREE.PlaneBufferGeometry(20000, 20000)
            let material = new THREE.MeshPhongMaterial({ shininess: 0.1 })
            let ground = new THREE.Mesh(geometry, material)

            ground.position.set(0, -250, 0)
            ground.rotation.x = -Math.PI / 2

            scene.add(ground)
            scene.fog = new THREE.Fog(0xffffff, 1000, 10000)

            let animationClip = scene.animations[0]
            mixer = new THREE.AnimationMixer(scene)
            mixer.clipAction(animationClip).play()

            animate()
        })

        window.onresize = () => {
            resetCameraSize(camera)
            camera.setSize(SCREEN_WIDTH, SCREEN_HEIGHT)
        }

        function resetCameraSize(camera) {
            camera.aspectRatio = SCREEN_WIDTH / SCREEN_HEIGHT
            camera.updateProjectionMatrix()
        }

        function animate() {
            requestAnimationFrame( animate )
            render()
        }

        function render() {
            let delta = 0.75 * clock.getDelta()
            mixer.update(delta)
            renderer.render(scene, camera)
        }
    },
    render() {
        return <div class={styles.container} ref="container"/>
    }
}
