import styles from './style.css'
import TreeView from '../tree-view'
import { mapGetters } from 'vuex'
import SceneItem from '../scene-item'
import IconButton from '@/ui/material-icon-button'
import { isCamera, isLight } from '../../common/util'

export default {
    name: 'scene-window',
    data: () => ({
        dragOverObj: null
    }),
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
        handleDrop(e, obj) {
            e.preventDefault()
            e.stopPropagation()
            if (obj && (isLight(obj) || isCamera(obj))) return false
            this.clearDragOverObj()

            const gameObjectId = e.dataTransfer.getData('gameObject')
            if (gameObjectId) {
                const dropObject = this.scene.getMeshByID(gameObjectId)
                if (!dropObject) return
                this.$store.dispatch('setGameObjectParent', { child: dropObject, parent: obj })
                    .then(() => this.$refs.treeView.setTreeData())
            }
        },
        handleDragOver(e, obj) {
            e.preventDefault()
            e.stopPropagation()
            if (!obj) return true
            if (isLight(obj) || isCamera(obj)) return false
            this.dragOverObj = obj
        },
        clearDragOverObj() {
            this.dragOverObj = null
        },
        renderItem(obj) {
            const isChosen = this.gameObject && obj.id === this.gameObject.id
            return <div draggable
                        onDragover={e => this.handleDragOver(e, obj)}
                        onDragleave={this.clearDragOverObj}
                        onDrop={e => this.handleDrop(e, obj)}
                        onDragstart={e => this.handleDragStart(e, obj)}
                        class={[styles.item, {
                            [styles.chosen]: isChosen,
                            [styles.dragOver]: this.dragOverObj === obj
                        }]}
                        onClick={() => this.handleInput(obj)}>
                <SceneItem value={obj} onInput={val => this.editGameObjectName(val, obj)}/>
                {isChosen && <IconButton iconClass={styles.deleteIcon} icon={'cancel'} size={32}
                                         onClick={() => this.removeGameObject(obj)}/>}
            </div>
        }
    },
    computed: mapGetters(['gameObject', 'gameObjects', 'scene']),
    render() {
        const {
            gameObject,
            gameObjects,
            renderItem,
            dropOnOutSide
        } = this

        return <div class={styles.sceneWindow}>
            {<TreeView data={gameObjects} ref='treeView'
                       getIdFunction={obj => obj.id}
                       getChildrenFunction={obj => Promise.resolve(obj.getChildren())}
                       haveChildrenFunction={obj => Promise.resolve(obj.getChildren() && obj.getChildren().length > 0)}
                       renderItemFunction={renderItem}
                       selected={gameObject}/>}
                       <div class={styles.dropArea} onDragover={e => this.handleDragOver(e, null)} onDrop={e => this.handleDrop(e, null)}/>
        </div>
    }
}
