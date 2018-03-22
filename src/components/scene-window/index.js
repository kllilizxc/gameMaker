import styles from './style.css'
import TreeView from '../tree-view'
import { mapGetters } from 'vuex'
import SceneItem from '../scene-item'

export default {
    name: 'scene-window',
    methods: {
        handleInput(obj) {
            this.$store.dispatch('setGameObject', obj)
        },
        editGameObjectName(name, obj) {
            obj.name = name
        }
    },
    computed: mapGetters(['gameObject', 'gameObjects']),
    render() {
        const {
            handleInput,
            gameObject,
            gameObjects,
            editGameObjectName
        } = this

        return <div class={styles.sceneWindow}>
            {<TreeView data={gameObjects.filter(filterFunc)}
                       getIdFunction={obj => obj.id}
                       getChildrenFunction={obj => Promise.resolve(obj.getChildren())}
                       haveChildrenFunction={obj => Promise.resolve(obj.getChildren().length > 0)}
                       renderItemFunction={obj => <SceneItem value={obj.name} onInput={val => editGameObjectName(val, obj)}/>}
                       onInput={handleInput} selected={gameObject}/>}
        </div>
    }
}

const filterFunc = o => true
