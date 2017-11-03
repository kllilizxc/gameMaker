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
            handleInput
        } = this

        return <div class={styles.sceneWindow}>
            <TreeView data={this.gameObjects}
                      getNameFunction={obj => obj.name}
                      getChildrenFunction={obj => obj.children}
                      onInput={handleInput}/>
        </div>
    }
}
