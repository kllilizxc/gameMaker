import styles from './style.css'
import Card from '@/ui/card'

export default {
    name: 'desktop',
    render() {
        return <div class={styles.desktop}>
            <div class={styles.flexContainer}>{this.$slots.flex}</div>
            {this.$slots.default}
        </div>
    }
}
