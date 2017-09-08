// @flow
import { afterTransition } from '@/common/util'

export default {
    name: 'hideable',
    props: {
        onHide: {
            type: Function,
            required: true
        },
        onShow: {
            type: Function,
            default: style => style.transform = ''
        },
        isLocked: {
            type: Boolean,
            default: false
        }
    },
    data: () => ({
        isHide: false,
        t: null
    }),
    methods: {
        hide(): void {
            if (this.isLocked || this.isHide) return
            this.onHide(this.$el.style)
            afterTransition(this.$el, () => {
                this.isHide = true
            })
        },
        show(): void {
            if (!this.isHide) return
            this.onShow(this.$el.style)
            afterTransition(this.$el, () => {
                this.isHide = false
            })
        },
        toggle(): void {
            this.isHide ? this.show() : this.hide()
        },
        handleMouseEnter(): void {
            clearTimeout(this.t)
            if (this.isHide)
                this.show()
        },
        handleMouseLeave(): void {
            clearTimeout(this.t)
            this.t = setTimeout(() => {
                if (!this.isHide)
                    this.hide()
            }, 500)
        }
    },
    render() {
        const {
            handleMouseEnter,
            handleMouseLeave
        } = this

        return <div onMouseenter={handleMouseEnter}
                    onMouseleave={handleMouseLeave}
                    style={{ transition: 'all 0.3s ease' }}>
            {this.$slots.default}
        </div>
    }
}
