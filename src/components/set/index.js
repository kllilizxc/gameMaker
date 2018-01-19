import styles from './style.css'
import Window from '../window'

export const handlerClass = styles.title

export default {
    name: 'set',
    props: {
        windows: {
            type: Array,
            default: () => []
        },
        getWindowsTitle: {
            type: Function,
            default: window => window.title
        }
    },
    render() {
        const { windows, getWindowsTitle } = this

        const title = windows[0] ? getWindowsTitle(windows[0]) : 'Empty Set'

        return <div class={styles.set}>
            <div class={styles.title}>{title}</div>
            { windows.map(window => <Window window={window}/>) }
        </div>
    }
}
