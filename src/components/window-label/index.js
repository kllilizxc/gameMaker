// @flow
import styles from './style.css'
import Card from 'Ui/card'

export default {
    name: 'window-label',
    render() {
        return <div class={styles.windowLabel}>
            <Card title="a label"/>
        </div>
    }
}
