import styles from './style.css'
import Card from '@/ui/card'

export default {
    name: 'window',
    props: {
        title: String,
        color: {
            type: String,
            default: '#fff'
        }
    },
    render() {
        const {
            title,
            color
        } = this

        return <div class={styles.window}>
            <Card class={styles.container}
                  title={title}
                  style={{backgroundColor: color}}>
            </Card>
        </div>
    }
}
