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
            {scene && scene.children && <TreeView data={scene.children.filter(filterFunc)}
                                                  getNameFunction={obj => obj.name}
                                                  getChildrenFunction={obj => Promise.resolve(obj.children)}
                                                  haveChildrenFunction={obj => Promise.resolve(obj.children && obj.children.length > 0)}
                                                  onInput={handleInput} selected={gameObject}/>}
        </div>
    }
}

const filterFunc = o =>
    !(o instanceof THREE.TransformControls
        || o instanceof THREE.BoxHelper)
