import styles from './style.css'
import Canvas from 'Components/canvas'
import Dock from 'Components/dock'
import { mapGetters } from 'vuex'
import { GameObject } from '../../classes/GameObject'
import AssetManager from '@/common/asset-manager'

function newBoxObject(scene) {
    const geometry = new THREE.BoxBufferGeometry(200, 200, 200)
    const material = new THREE.MeshBasicMaterial()
    const mesh = new THREE.Mesh(geometry, material)
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
                                window.scene = loadedScene
                                const scene = new GameObject(loadedScene)
                                console.log('scene', scene)
                                this.$store.dispatch('setScene', scene)
                                this.$store.dispatch('setGameObject', scene.children[0])
                                this.$store.dispatch('setGameObjects', scene.children)
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
                    newBoxObject(scene.raw)
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
