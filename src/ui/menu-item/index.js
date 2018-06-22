import styles from './styles.css'

export default {
    functional: true,
    render(h, { props: { title }, listeners }) {
        return <div class={styles.item} onClick={listeners.click}>
            <mu-ripple>{title}</mu-ripple>
        </div>
    }
}
