import styles from './style.css'
import DesktopManager from '@/components/desktop-manager'
import ScriptWindow from '@/components/script-window'
import SceneWindow from '@/components/scene-window'
import ExplorerWindow from '@/components/explorer-window'
import CanvasWindow from '@/components/canvas-window'

import WindowClass from './classes/Window'
import COLORS from '@/common/colors.css'
import THREELib from 'three-js'
import { GameObject } from './classes/GameObject'

const THREE = THREELib()

export default {
    name: 'app',
    data: () => ({
        scene: null,
        sceneGameObject: null,
        currentGameObject: null,
        gameObjects: []
    }),
    methods: {
        chooseGameObject(obj) {
            this.currentGameObject = obj
        }
    },
    computed: {
        windowLabels() {
            const { sceneGameObject, chooseGameObject, currentGameObject } = this
            return [
                new WindowClass('dashboard', 'Inspector', COLORS['Grey-50'], <ScriptWindow gameObject={currentGameObject}/>),
                new WindowClass('subject', 'Scene', COLORS['Grey-100'], <SceneWindow scene={sceneGameObject} onInput={chooseGameObject}/>),
                new WindowClass('folder', 'Explorer', COLORS['Grey-200'], <ExplorerWindow/>),
                new WindowClass('delete', 'delete', '#80CBC4'),
                new WindowClass('polymer', 'polymer', '#E6EE9C')
            ]
        },
        defaultWindow() {
            return new WindowClass('', 'Canvas', '#fff', <CanvasWindow scene={this.scene}/>, false, 4)
        }
    },
    created() {
        new THREE.ObjectLoader().load('static/scenes/scene-animation.json', loadedScene => {
            this.scene = loadedScene
            window.scene = this.scene
            this.sceneGameObject = new GameObject(this.scene)
            this.currentGameObject = this.sceneGameObject.children[0]
        })
    },
    render() {
        const { windowLabels, defaultWindow } = this

        return <div id="app" class={styles.app}>
            <DesktopManager ref="desktopManager" windows={windowLabels} defaultWindow={defaultWindow}/>
        </div>
    }
}
