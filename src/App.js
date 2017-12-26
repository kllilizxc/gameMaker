import styles from './style.css'
import DesktopManager from '@/components/desktop-manager'
import ScriptWindow from '@/components/script-window'
import SceneWindow from '@/components/scene-window'
import ExplorerWindow from '@/components/explorer-window'
import CanvasWindow from '@/components/canvas-window'

import COLORS from '@/common/colors.css'
import THREELib from 'three-js'

const THREE = THREELib()

export default {
    name: 'app',
    data: () => ({
        scene: null
    }),
    computed: {
        windowLabels() {
            return [
                { icon: 'dashboard', title: 'Inspector', color: COLORS['Grey-50'], content: <ScriptWindow/> },
                { icon: 'subject', title: 'Scene', color: COLORS['Grey-100'], content: <SceneWindow/> },
                { icon: 'folder', title: 'Explorer', color: COLORS['Grey-200'], content: <ExplorerWindow/> },
                { icon: 'delete', title: 'delete', color: '#80CBC4' },
                { icon: 'polymer', title: 'polymer', color: '#E6EE9C' }
            ]
        },
        defaultWindow() {
            return { color: '#fff', size: 4, content: <CanvasWindow scene={this.scene}/> }
        }
    },
    created() {
        new THREE.ObjectLoader().load('static/scenes/scene-animation.json', loadedScene => {
            this.scene = loadedScene
            console.log(this.scene)
        })
    },
    render() {
        const { windowLabels, defaultWindow } = this

        return <div id="app" class={styles.app}>
            <DesktopManager ref="desktopManager" windowLabels={windowLabels} defaultWindow={defaultWindow}/>
        </div>
    }
}
