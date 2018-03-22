import styles from './style.css'
import TreeView from '../tree-view'
import { mapGetters } from 'vuex'

export default {
    name: 'scene-window',
    methods: {
        handleInput(obj) {
            this.$store.dispatch('setGameObject', obj)
        }
    },
    computed: mapGetters(['gameObject', 'gameObjects']),
    render() {
        const {
            handleInput,
            gameObject,
            gameObjects
        } = this

        return <div class={styles.sceneWindow}>
            {<TreeView data={gameObjects.filter(filterFunc)}
                                                  getNameFunction={obj => obj.name} getIdFunction={obj => obj.id}
                                                  getChildrenFunction={obj => Promise.resolve(obj.getChildren())}
                                                  haveChildrenFunction={obj => Promise.resolve(obj.getChildren().length > 0)}
                                                  onInput={handleInput} selected={gameObject}/>}
        </div>
    }
}

const filterFunc = o => true
