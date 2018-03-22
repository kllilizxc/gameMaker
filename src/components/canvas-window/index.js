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
    data: () => ({
        editMode: 0
    }),
    computed: {
        ...mapGetters(['isPlaying', 'scene']),
        canvas() { return this.$refs.canvas }
    },
    methods: {
        openScene() {
            AssetManager.pickFile('Please pick the scene json file')
                .then(filename => this.$store.dispatch('openScene', filename))
        },
        togglePlay() {
            this.$store.dispatch('setIsPlaying', !this.isPlaying)
        },
        saveScene() {
            AssetManager.saveFile(
                'Now pick a file to save your scene',
                [{ name: 'Scene', extensions: ['babylon'] }])
                .then(filename => this.$store.dispatch('saveScene', filename))
        },
        setEditMode() {
            const { canvas } = this
            this.editMode = (this.editMode + 1) % 3
            switch (this.editMode) {
                case 0: return canvas.enableTranslation()
                case 1: return canvas.enableRotation()
                case 2: return canvas.enableScaling()
            }
        }
    },
    render(h) {
        const { editMode, isPlaying, openScene, togglePlay, saveScene, setEditMode } = this

        const origin = { horizontal: 'left', vertical: 'bottom' }

        return <div class={styles.canvasWindow}>
            <Canvas ref='canvas'/>
            <Dock class={styles.dock}>
                <IconButton slot='left' icon='folder_open' onClick={openScene}/>
                <IconButton slot='left' icon='save' onClick={saveScene}/>
                <IconMenu slot='right' icon='add' anchorOrigin={origin} targetOrigin={origin}>
                    {gameObjects.map(gameObject => <MenuItem title={gameObject} onClick={() => this.canvas[`create${gameObject}`]()}/>)}
                </IconMenu>
                <IconButton slot='right' icon={isPlaying ? 'pause' : 'play_arrow'} onClick={togglePlay}/>
                <IconButton slot='right' icon={editMode === 0 ? 'open_with' : editMode === 1 ? 'crop_rotate' : 'zoom_out_map'} onClick={setEditMode}/>
            </Dock>
        </div>
    }
}
