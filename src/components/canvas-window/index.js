import styles from './style.css'
import Canvas from 'Components/canvas'
import Dock from 'Components/dock'
import { mapGetters } from 'vuex'
import AssetManager from '@/common/asset-manager'

export default {
    name: 'canvas-window',
    computed: {
        ...mapGetters(['isPlaying']),
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
            return {
                icon: 'add',
                clickHandler: () => this.$refs.canvas.newSphere()
            }
        }
    },
    render(h) {
        const { openSceneTool, newGameObjectTool, playTool } = this
        const leftTools = [openSceneTool, newGameObjectTool, playTool]

        return <div class={styles.canvasWindow}>
            <Canvas ref='canvas'/>
            <Dock class={styles.dock} leftTools={leftTools}/>
        </div>
    }
}
