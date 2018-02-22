import styles from './style.css'
import DesktopManager from '@/components/desktop-manager'
import ScriptWindow from '@/components/script-window'
import SceneWindow from '@/components/scene-window'
import ExplorerWindow from '@/components/explorer-window'
import CanvasWindow from '@/components/canvas-window'

import COLORS from '@/common/colors.css'
import THREELib from 'three-js'
import { GameObject } from './classes/GameObject'

const THREE = THREELib()

export default {
    name: 'app',
    data: () => ({
        scene: null,
        sceneGameObject: null,
        gameObjects: []
    }),
    methods: {
        chooseGameObject(obj) {
            this.$store.dispatch('setGameObject', obj)
        }
    },
    computed: {
        windowLabels() {
            const { sceneGameObject, chooseGameObject } = this
            return [
                { icon: 'dashboard', title: 'Inspector', color: COLORS['Grey-50'], content: <ScriptWindow/> },
                { icon: 'subject', title: 'Scene', color: COLORS['Grey-100'], content: <SceneWindow scene={sceneGameObject} onInput={chooseGameObject}/> },
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
        window.$vm0 = this  // for debug

        new THREE.ObjectLoader().load('static/scenes/scene-animation.json', loadedScene => {
            this.scene = loadedScene
            window.scene = this.scene
            this.sceneGameObject = new GameObject(this.scene)
            this.$store.dispatch('setGameObject', this.sceneGameObject.children[0])
            console.log(this.sceneGameObject)
            this.$store.dispatch('setGameObjects', this.sceneGameObject.children)
        })
    },
    render() {
        const { windowLabels, defaultWindow } = this

        return <div id="app" class={styles.app}>
            <DesktopManager ref="desktopManager" windowLabels={windowLabels} defaultWindow={defaultWindow}/>
        </div>
    }
}
