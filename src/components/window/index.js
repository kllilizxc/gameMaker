// @flow
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
    methods: {
        handleTouchStart(): void {

        },
        handleTouchMove(deltaX): void {
        },
        handleTouchEnd(deltaX, stopDragging): void {

        }
    },
    render() {
        const {
            title,
            color,
            handleTouchStart,
            handleTouchMove,
            handleTouchEnd,
        } = this

        return <div class={styles.window}
                    touchStart={handleTouchStart}
                    touchMove={handleTouchMove}
                    touchEnd={handleTouchEnd}>
            <Card class={styles.container}
                  title={title}
                  style={{ backgroundColor: color }}>
            </Card>
        </div>
    }
}
