import styles from './style.css'
import Canvas from 'Components/canvas'
import Dock from 'Components/dock'
import { mapGetters } from 'vuex'
import AssetManager from '@/common/asset-manager'

function newBoxObject(scene) {
    const geometry = new THREE.BoxBufferGeometry(200, 200, 200)
    const material = new THREE.MeshBasicMaterial()
    const mesh = new THREE.Mesh(geometry, material)
    mesh.name = 'box'
    scene.add(mesh)
}

export default {
    name: 'canvas-window',
    computed: {
        ...mapGetters(['isPlaying', 'scene']),
        playTool() {
            const { isPlaying, $store: { dispatch } } = this
            return isPlaying
                ? { icon: 'pause', clickHandler: () => dispatch('setIsPlaying', false) }
                : { icon: 'play_arrow', clickHandler: () => dispatch('setIsPlaying', true) }
        },
        openSceneTool() {
            return {
                icon: 'folder_open',
                clickHandler: () => {
                    AssetManager.pickFile('Please pick the scene json file')
                        .then(filePath => {
                            new THREE.ObjectLoader().load(filePath, loadedScene => {
                                const scene = loadedScene
                                window.scene = scene
                                this.$store.dispatch('setScene', scene)
                            })
                        })
                }
            }
        },
        newGameObjectTool() {
            const { scene } = this

            return {
                icon: 'add',
                clickHandler() {
                    newBoxObject(scene)
                }
            }
        }
    },
    render(h) {
        const { openSceneTool, newGameObjectTool, playTool } = this
        const leftTools = [openSceneTool, newGameObjectTool, playTool]

        return <div class={styles.canvasWindow}>
            <Canvas/>
            <Dock class={styles.dock} leftTools={leftTools}/>
        </div>
    }
}
