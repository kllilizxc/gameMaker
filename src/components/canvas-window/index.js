import styles from './style.css'
import Canvas from 'Components/canvas'
import Dock from 'Components/dock'
import { mapGetters } from 'vuex'

export default {
    name: 'canvas-window',
    props: {
        scene: Object
    },
    computed: {
        ...mapGetters(['isPlaying']),
        playTool() {
            const { isPlaying, $store: { dispatch } } = this
            return isPlaying
                ? { icon: 'pause', clickHandler: () => dispatch('setPlay', false) }
                : { icon: 'play_arrow', clickHandler: () => dispatch('setPlay', true) }
        }
    },
    render(h) {
        const { playTool, scene } = this
        const leftTools = [playTool]

        return <div class={styles.canvasWindow}>
            <Canvas scene={scene}/>
            <Dock class={styles.dock} leftTools={leftTools}/>
        </div>
    }
}
