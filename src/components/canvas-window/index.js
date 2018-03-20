import styles from './style.css'
import Canvas from 'Components/canvas'
import Dock from 'Components/dock'
import { mapGetters } from 'vuex'
import AssetManager from '@/common/asset-manager'
import * as BABYLON from 'babylonjs'

function newSphere(scene) {
    const sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene, false, BABYLON.Mesh.FRONTSIDE)
    // Move the sphere upward 1/2 of its height
    sphere.position.y = 1
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
                        .then(filePath => null) // TODO import scene
                }
            }
        },
        newGameObjectTool() {
            const { scene } = this

            return {
                icon: 'add',
                clickHandler() {
                    newSphere(scene)
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
