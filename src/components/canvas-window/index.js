import styles from './style.css'
import Canvas from 'Components/canvas'
import Dock from 'Components/dock'
import { mapGetters } from 'vuex'
import AssetManager from '@/common/asset-manager'
import IconButton from '@/ui/material-icon-button'
import IconMenu from '@/ui/icon-menu'
import MenuItem from '@/ui/menu-item'

const gameObjects = ['Sphere', 'Box', 'Plane', 'Ground', 'PointLight', 'DirectionalLight', 'SpotLight', 'HemisphericLight']

export default {
    name: 'canvas-window',
    computed: {
        ...mapGetters(['isPlaying']),
        canvas() { return this.$refs.canvas }
    },
    methods: {
        openScene() {
            AssetManager.pickFile('Please pick the scene json file')
                .then(filePath => null) // TODO import scene
        },
        togglePlay() {
            this.$store.dispatch('setIsPlaying', !this.isPlaying)
        }
    },
    render(h) {
        const { isPlaying, openScene, togglePlay } = this

        const origin = { horizontal: 'left', vertical: 'bottom' }

        return <div class={styles.canvasWindow}>
            <Canvas ref='canvas'/>
            <Dock class={styles.dock}>
                <IconButton slot='left' icon='folder_open' onClick={openScene}/>
                <IconMenu slot='left' icon='add' anchorOrigin={origin} targetOrigin={origin}>
                    {gameObjects.map(gameObject => <MenuItem title={gameObject} onClick={() => this.canvas[`create${gameObject}`]()}/>)}
                </IconMenu>
                <IconButton slot='left' icon={isPlaying ? 'pause' : 'play_arrow'} onClick={togglePlay}/>
            </Dock>
        </div>
    }
}
