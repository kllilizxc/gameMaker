import styles from './style.css'

export default {
    name: 'desktop',
    render() {
        return <div class={styles.desktop}>
            {this.$slots.default}
        </div>
    }
}
