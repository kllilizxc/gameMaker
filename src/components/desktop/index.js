import styles from './style.css'
import Card from '@/ui/card'

export default {
    name: 'desktop',
    render() {
        return <div class={styles.desktop}>
            {this.$slots.default}
        </div>
    }
}
