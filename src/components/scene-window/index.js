import styles from './style.css'
import TreeView from '../tree-view'
import { mapGetters } from 'vuex'
import SceneItem from '../scene-item'
import GameObject from '../../classes/gameObject'
import UndoableAction from '../../classes/undoableAction'

export default {
    name: 'scene-window',
    methods: {
        chooseGameObject(obj) {
            this.$store.dispatch('setGameObject', obj)
        },
        removeGameObject(obj) {
            this.$store.dispatch('setGameObject', null)
            obj.dispose()
            this.$refs.treeView.setTreeData()
        },
        handleDrop({ e, obj }) {
            const gameObjectId = e.dataTransfer.getData('gameObject')
            if (obj && gameObjectId === obj.id) return
            if (gameObjectId) {
                const dropMesh = GameObject.findGameObjectById(gameObjectId)
                if (!dropMesh) return
                const parentMesh = dropMesh.getMesh().parent
                UndoableAction.addAction(new UndoableAction(parentMesh && parentMesh.gameObject, obj,
                    val => this.$store.dispatch('setGameObjectParent', { child: dropMesh, parent: val })
                        .then(() => this.$refs.treeView.setTreeData())))
            }
        },
        renderItem(obj) {
            const isChosen = this.gameObject && obj.id === this.gameObject.id
            return <SceneItem isChosen={isChosen}
                              value={obj}
                              onClick={this.chooseGameObject}
                              onDrop={this.handleDrop}
                              onDragOver={() => true}
                              onDelete={this.removeGameObject}/>
        }
    },
    computed: mapGetters(['gameObject', 'gameObjects', 'scene']),
    render() {
        const {
            gameObject,
            gameObjects,
            renderItem
        } = this

        return <div class={styles.sceneWindow}>
            <TreeView data={gameObjects} ref='treeView'
                      getIdFunction={obj => obj.id}
                      initFold={false}
                      getChildrenFunction={obj => obj.getChildren()}
                      haveChildrenFunction={obj => obj.getChildren() && obj.getChildren().length > 0}
                      renderItemFunction={renderItem}
                      selected={gameObject}/>
            <div class={styles.dropArea} onDragover={e => {
                e.preventDefault()
                e.stopPropagation()
            }} onDrop={e => this.handleDrop({ e, obj: null })}/>
        </div>
    }
}
