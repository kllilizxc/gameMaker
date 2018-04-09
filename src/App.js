import styles from './style.css'
import DesktopManager from '@/components/desktop-manager'
import ScriptWindow from '@/components/script-window'
import SceneWindow from '@/components/scene-window'
import ExplorerWindow from '@/components/explorer-window'
import CanvasWindow from '@/components/canvas-window'
import COLORS from '@/common/colors.css'

import { mapGetters } from 'vuex'

export default {
    name: 'app',
    computed: {
        ...mapGetters(['scene', 'gameObject']),
        windowLabels() {
            return [
                { icon: 'dashboard', title: 'Inspector', color: COLORS['Grey-50'], content: <ScriptWindow/> },
                { icon: 'subject', title: 'Scene', color: COLORS['Grey-100'], content: <SceneWindow ref='sceneWindow'/> },
                { icon: 'folder', title: 'Explorer', color: COLORS['Grey-200'], content: <ExplorerWindow/> }
            ]
        },
        defaultWindow() {
            return { color: '#fff', size: 4, content: <CanvasWindow/> }
        }
    },
    created() {
        window.$vm0 = this  // for debug
        document.onkeydown = e => {
            if (e.ctrlKey && e.code === 'KeyD') {
                // ctrl + d
                this.$store.dispatch('duplicateGameObject')
                    .then(() => this.$refs.sceneWindow.$refs.treeView.setTreeData())
            } else if (e.code === 'KeyF') {
                const { scene, gameObject } = this
                if (scene && scene.activeCamera && scene.activeCamera.setTarget)
                    scene.activeCamera.setTarget(gameObject.getMesh().getAbsolutePosition())
            }
        }
    },
    render() {
        const { windowLabels, defaultWindow } = this

        return <div id="app" class={styles.app}>
            <DesktopManager ref="desktopManager" windowLabels={windowLabels} defaultWindow={defaultWindow}/>
        </div>
    }
}
