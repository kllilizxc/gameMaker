import styles from './style.css'
import Canvas from 'Components/canvas'

export default {
    functional: true,
    render(h, context) {
        return h(Canvas, context.data)
    }
}
