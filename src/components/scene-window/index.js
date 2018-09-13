import styles from './style.css'
import TreeView from '../tree-view'
import { mapGetters } from 'vuex'
import SceneItem from '../scene-item'
import GameObject from '../../classes/gameObject'

export default {
    name: 'scene-window',
    methods: {
        chooseGameObject(obj) {
            this.$store.dispatch('setGameObject', obj)
        },
        removeGameObject(obj) {
            obj.dispose()
            this.$store.dispatch('setGameObject', null)
            this.$refs.treeView.setTreeData()
        },
        handleDrop({ e, obj }) {
            const gameObjectId = e.dataTransfer.getData('gameObject')
            if (obj && gameObjectId === obj.id) return
            if (gameObjectId) {
                const dropMesh = GameObject.findGameObjectById(gameObjectId)
                if (!dropMesh) return
                this.$store.dispatch('setGameObjectParent', { child: dropMesh, parent: obj })
                    .then(() => this.$refs.treeView.setTreeData())
            }
        },
        handleDelete(obj) {
            obj.dispose()
        },
        renderItem(obj) {
            const isChosen = this.gameObject && obj.id === this.gameObject.id
            return <SceneItem isChosen={isChosen}
                              value={obj}
                              onClick={this.chooseGameObject}
                              onDrop={this.handleDrop}
                              onDelete={this.handleDelete}
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
                      getChildrenFunction={obj => Promise.resolve(obj.getChildren())}
                      haveChildrenFunction={obj => Promise.resolve(obj.getChildren() && obj.getChildren().length > 0)}
                      renderItemFunction={renderItem}
                      selected={gameObject}/>
            <div class={styles.dropArea} onDragover={e => {
                e.preventDefault()
                e.stopPropagation()
            }} onDrop={e => this.handleDrop({ e, obj: null })}/>
        </div>
    }
}
