import styles from './style.css'
import DesktopManager from '@/components/desktop-manager'
import ScriptWindow from '@/components/inspector-window'
import SceneWindow from '@/components/scene-window'
import ExplorerWindow from '@/components/explorer'
import CanvasWindow from '@/components/canvas-window'
import CodeEditor from '@/components/code-editor'
import AnimationEditor from '@/components/animation-editor'
import { DialogOutlet } from '@/components/dialog'
import ThemeColors from 'Common/theme.css'

import { mapGetters } from 'vuex'

import * as API from './common/api'
import UndoableAction from './classes/undoableAction'

window.gm = API

export default {
    name: 'app',
    computed: {
        ...mapGetters(['game', 'gameObject']),
        windowLabels() {
            return [
                { icon: 'dashboard', title: 'Inspector', color: ThemeColors.Inspector, content: <ScriptWindow/> },
                { icon: 'subject', title: 'Scene', color: ThemeColors.Scene, content: <SceneWindow ref='sceneWindow'/> },
                { icon: 'folder', title: 'Explorer', color: ThemeColors.Explorer, content: <ExplorerWindow/> },
                { icon: 'code', title: 'Code Editor', color: ThemeColors.CodeEditor, content: <CodeEditor/> },
                { icon: 'play_circle_filled', title: 'Animation Editor', color: ThemeColors.AnimationEditor, content: <AnimationEditor/> }
            ]
        },
        defaultWindow() {
            return { color: '#fff', size: 4, content: <CanvasWindow/> }
        }
    },
    created() {
        window.$vm0 = this  // for debug
        document.onkeydown = e => {
            if (e.ctrlKey && e.altKey && e.code === 'KeyD') {
                // ctrl + d
                this.$store.dispatch('duplicateGameObject')
                    .then(() => this.$refs.sceneWindow.$refs.treeView.setTreeData())
            } else if (e.ctrlKey && e.altKey && e.code === 'KeyF') {
                const { game, gameObject } = this
                game.setCameraTarget(gameObject)
            } else if (e.ctrlKey && e.shiftKey && e.code === 'KeyZ') {
                // ctrl + shift + z
                UndoableAction.redoAction()
            } else if (e.ctrlKey && e.code === 'KeyZ') {
                // ctrl + z
                UndoableAction.undoAction()
            }
        }
    },
    render() {
        const { windowLabels, defaultWindow } = this

        return <div id="app" class={styles.app}>
            <DialogOutlet/>
            <DesktopManager ref="desktopManager" windowLabels={windowLabels} defaultWindow={defaultWindow}/>
        </div>
    }
}
