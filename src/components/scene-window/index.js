import styles from './style.css'
import TreeView from '../tree-view'
import { mapGetters } from 'vuex'

export default {
    name: 'scene-window',
    data: () => ({
    }),
    methods: {
        handleInput (obj) {
            this.$store.dispatch('setGameObject', obj)
        }
    },
    computed: mapGetters(['scene']),
    render () {
        const {
            handleInput,
            scene
        } = this

        return <div class={styles.sceneWindow}>
            {scene && scene.children && <TreeView data={scene.children}
                      getNameFunction={obj => obj.name}
                      getChildrenFunction={obj => Promise.resolve(obj.children)}
                      haveChildrenFunction={obj => Promise.resolve(obj.children && obj.children.length > 0)}
                      onInput={handleInput}/>}
        </div>
    }
}
