import styles from './style.css'
import IconButton from '@/ui/material-icon-button'
import Card from '@/ui/card'

export default {
    name: 'fixed-ui',
    methods: {
        gotoLastDesktop() {
            this.$emit('gotoLastDesktop')
        },
        gotoNextDesktop() {
            this.$emit('gotoNextDesktop')
        }
    },
    render() {
        let {
            gotoLastDesktop,
            gotoNextDesktop
        } = this

        return <div class={styles.fixedUI}>
            <div class={styles.toLeft}><Card rounded><IconButton icon="keyboard_arrow_left" onClick={gotoLastDesktop}/></Card></div>
            <div class={styles.toRight}><Card rounded><IconButton icon="keyboard_arrow_right" onClick={gotoNextDesktop}/></Card></div>
        </div>
    }
}
