// @flow
import card from '@/ui/card'
import dockItem from '@/components/dock-item'

export default {
    name: 'dock',
    components: { card, dockItem },
    props: {
        leftTools: Array,
        rightTools: Array
    },
    data: () => ({
        isHide: false
    }),
    methods: {
        hide(): void {
            console.log(this.$el.style)
            this.$el.style.transform = `translateY(100%)`
            this.afterTransition(() => {
                this.isHide = true
            })
        },
        show(): void {
            this.$el.style.transform = 'translateY(0)'
            this.afterTransition(() => {
                this.isHide = false
            })
        },
        toggle(): void {
            this.isHide ? this.show() : this.hide()
        },
        afterTransition(callback: () => void) {
            const handler = () => {
                callback()
                this.$el.removeEventListener('transitionend', handler)
            }
            this.$el.addEventListener('transitionend', handler)
        },
        handleMouseOver(): void {
            if (this.isHide)
                this.show()
        }
    }
}
