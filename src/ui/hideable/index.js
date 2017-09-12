// @flow
import { afterTransition } from '@/common/util'

export default {
    name: 'hideable',
    props: {
        hideFunction: {
            type: Function,
            required: true
        },
        showFunction: {
            type: Function,
            default: style => style.transform = ''
        },
        isLocked: {
            type: Boolean,
            default: false
        }
    },
    data: () => ({
        isHide: true,
        t: null
    }),
    mounted() {
        if (!this.isLocked)
            this.hideFunction(this.$el.style)
    },
    methods: {
        hide(): void {
            if (this.isLocked || this.isHide) return
            this.hideFunction(this.$el.style)
            afterTransition(this.$el, () => {
                this.isHide = true
            })
        },
        show(): void {
            if (this.isLocked || !this.isHide) return
            this.showFunction(this.$el.style)
            afterTransition(this.$el, () => {
                this.isHide = false
            })
        },
        toggle(): void {
            this.isHide ? this.show() : this.hide()
        },
        handleMouseEnter(): void {
            if (this.isLocked) return
            clearTimeout(this.t)
            if (this.isHide)
                this.show()
        },
        handleMouseLeave(): void {
            if (this.isLocked) return
            clearTimeout(this.t)
            this.t = setTimeout(() => {
                if (!this.isHide)
                    this.hide()
            }, 500)
        }
    },
    render() {
        const {
            isLocked,
            handleMouseEnter,
            handleMouseLeave
        } = this

        return <div onMouseenter={handleMouseEnter}
                    onTouchstart={handleMouseEnter}
                    onMouseleave={handleMouseLeave}
                    onTouchend={handleMouseLeave}
                    style={{ transition: isLocked ? 'none' : 'all 0.3s ease' }}>
            {this.$slots.default}
        </div>
    }
}
