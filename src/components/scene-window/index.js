import styles from './style.css'
import TreeView from '../tree-view'

export default {
    name: 'scene-window',
    data: () => ({
        gameObjects: [
            { name: 'Cube' },
            { name: 'Sphere' },
            { name: 'Cube2', children: [{ name: 'hello' }, { name: 'what' }] },
            { name: 'Cube3', children: [{ name: 'hello2', children: [{ name: 'test3' }] }, { name: 'what' }] }
        ]
    }),
    methods: {
        handleInput (obj) {
            console.log(obj.name)
        }
    },
    render () {
        const {
            gameObjects,
            handleInput
        } = this

        return <div class={styles.sceneWindow}>
            <TreeView data={gameObjects}
                      getNameFunction={obj => obj.name}
                      getChildrenFunction={obj => Promise.resolve(obj.children)}
                      haveChildrenFunction={obj => Promise.resolve(obj.children && obj.children.length > 0)}
                      onInput={handleInput}/>
        </div>
    }
}
