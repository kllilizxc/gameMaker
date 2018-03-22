import styles from './style.css'
import TreeView from '../tree-view'
import { mapGetters } from 'vuex'
import SceneItem from '../scene-item'
import IconButton from '@/ui/material-icon-button'

export default {
    name: 'scene-window',
    methods: {
        handleInput(obj) {
            this.$store.dispatch('setGameObject', obj)
        },
        removeGameObject(obj) {
            this.$store.dispatch('removeGameObject', obj)
        },
        editGameObjectName(name, obj) {
            obj.name = name
        },
        handleDragStart(e, obj) {
            e.dataTransfer.setData('gameObject', obj.id)
        },
        renderItem(obj) {
            const isChosen = this.gameObject && obj.id === this.gameObject.id
            return <div draggable onDragstart={e => this.handleDragStart(e, obj)} class={[styles.item, { [styles.chosen]: isChosen }]} onClick={() => this.handleInput(obj)}>
                <SceneItem value={obj.name} onInput={val => this.editGameObjectName(val, obj)}/>
                {isChosen && <IconButton iconClass={styles.deleteIcon} icon={'cancel'} size={24} onClick={() => this.removeGameObject(obj)}/>}
            </div>
        }
    },
    computed: mapGetters(['gameObject', 'gameObjects']),
    render() {
        const {
            gameObject,
            gameObjects,
            renderItem
        } = this

        return <div class={styles.sceneWindow}>
            {<TreeView data={gameObjects}
                       getIdFunction={obj => obj.id}
                       getChildrenFunction={obj => Promise.resolve(obj.getChildren())}
                       haveChildrenFunction={obj => Promise.resolve(obj.getChildren().length > 0)}
                       renderItemFunction={renderItem}
                       selected={gameObject}/>}
        </div>
    }
}
