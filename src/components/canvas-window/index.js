import styles from './style.css'
import Canvas from 'Components/canvas'
import Dock from 'Components/dock'
import { mapGetters } from 'vuex'
import fileDialog from 'file-dialog'
import { GameObject } from '../../classes/GameObject'
import THREELib from 'three-js'

const THREE = THREELib()

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
                    fileDialog({ accept: '.json' })
                        .then(fileList => {
                            const file = fileList[0]
                            console.log(file)
                            new THREE.ObjectLoader().load(file.path, loadedScene => {
                                window.scene = loadedScene
                                this.$store.dispatch('setScene', new GameObject(loadedScene))
                                this.$store.dispatch('setGameObject', this.scene.children[0])
                                console.log('scene', this.scene)
                                this.$store.dispatch('setGameObjects', this.scene.children)
                            })
                        })
                }
            }
        }
    },
    render(h) {
        const { openSceneTool, playTool } = this
        const leftTools = [openSceneTool, playTool]

        return <div class={styles.canvasWindow}>
            <Canvas/>
            <Dock class={styles.dock} leftTools={leftTools}/>
        </div>
    }
}
