// @flow
// @jsx h
import card from '@/ui/card'
import dockItem from '@/components/dock-item'
import hideable from '@/ui/hideable'

export default {
    name: 'dock',
    components: { card, dockItem, hideable },
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
