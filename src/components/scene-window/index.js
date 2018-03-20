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
    computed: mapGetters(['scene', 'gameObject']),
    render() {
        const {
            handleInput,
            gameObject,
            scene
        } = this

        return <div class={styles.sceneWindow}>
            {scene && scene.meshes && <TreeView data={scene.meshes.filter(filterFunc)}
                                                  getNameFunction={obj => obj.name}
                                                  getChildrenFunction={obj => Promise.resolve(obj.getChildren())}
                                                  haveChildrenFunction={obj => Promise.resolve(obj.getChildren().length > 0)}
                                                  onInput={handleInput} selected={gameObject}/>}
        </div>
    }
}

const filterFunc = o => true
