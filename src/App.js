import styles from './style.css'
import DesktopManager from '@/components/desktop-manager'
import ScriptWindow from '@/components/inspector-window'
import SceneWindow from '@/components/scene-window'
import ExplorerWindow from '@/components/explorer'
import CanvasWindow from '@/components/canvas-window'
import CodeEditor from '@/components/code-editor'
import AnimationEditor from '@/components/animation-editor'
import COLORS from '@/common/colors.css'
import { DialogOutlet } from '@/components/dialog'

import { mapGetters } from 'vuex'

import * as API from './common/api'
import UndoableAction from './classes/undoableAction'

window.gm = API

const themes = [
    [COLORS['Grey-50'], COLORS['Grey-100'], COLORS['Grey-200'], COLORS['Grey-300'], COLORS['Grey-400']],
    ['#D9C5BC', '#46B29D', '#C06C84', '#E37B40', '#CDABCA'],
    ['#324D5C', '#46B29D', '#F0CA4D', '#E37B40', '#DE5B49'],
    ['#F1DE98', '#F0B885', '#D66761', '#EE6C62', '#384059'],
    ['#FBF6BF', '#FFBF94', '#CD7044', '#DA9A6E', '#F4A062'],
    ['#F8B195', '#6C5B7B', '#C06C84', '#F67280', '#355C7D'],
    ['#D9C5BC', '#A7BFA8', '#C06C84', '#BD9C8D', '#D9C18F']
]

let currentTheme = themes[6]

export default {
    name: 'app',
    computed: {
        ...mapGetters(['game', 'gameObject']),
        windowLabels() {
            return [
                { icon: 'dashboard', title: 'Inspector', color: currentTheme[0], content: <ScriptWindow/> },
                { icon: 'subject', title: 'Scene', color: currentTheme[1], content: <SceneWindow ref='sceneWindow'/> },
                { icon: 'folder', title: 'Explorer', color: currentTheme[2], content: <ExplorerWindow/> },
                { icon: 'code', title: 'Code Editor', color: currentTheme[3], content: <CodeEditor/> },
                { icon: 'play_circle_filled', title: 'Animation Editor', color: currentTheme[4], content: <AnimationEditor/> }
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
