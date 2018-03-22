// @flow
// @jsx h
import card from '@/ui/card'
import hideable from '@/ui/hideable'
import iconButton from '@/ui/material-icon-button'

export default {
    name: 'dock',
    components: { card, hideable, iconButton },
    props: {
        leftTools: Array,
        rightTools: Array
    },
    data: () => ({
        isLocked: true
    }),
    methods: {
        hide(style): void {
            style.transform = 'translateY(90%)'
        },
        toggleLock(): void {
            this.isLocked = !this.isLocked
        }
    }
}
