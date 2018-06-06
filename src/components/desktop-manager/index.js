// @flow
// @jsx h
import styles from './style.css'
import Desktop from '@/components/desktop'
import Window from '@/components/window'
import FloatButton from '@/ui/float-button'
import Hideable from '@/ui/hideable'
import WindowLabel from '@/components/window-label'
import { afterTransition } from '../../common/util'
import Vue from 'vue'

type WindowType = {
    title: string,
    content: any,
    size: number,
    isMoving: boolean
}

type DesktopType = {
    windows: WindowType[]
}

export const MAX_SIZE: number = 4

function sizeToPX(size = 1) {
    return size * window.innerWidth / MAX_SIZE
}

export default {
    name: 'desktop-manager',
    props: {
        windowLabels: Array,
        defaultWindow: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            desktops: [{ windows: [this.defaultWindow] }],
            currentDesktopIndex: 0,
            currentWindowIndex: 0,
            windowHintSize: 0,
            lastWindowWidth: 0,
            currentWindowWidth: 0,
            currentWindow: null,
            isNewWindow: false
        }
    },
    watch: {
        currentDesktopIndex(index: number): void {
            if (this.$el && this.$el.style)
                this.$el.style.transform = `translateX(${-100 * index}vw)`
        },
        currentWindowWidth(val) {
            this.currentWindowRef.$el.style.width = val + 'px'
        },
        defaultWindow(val) {
            Vue.set(this.desktops[0].windows, '0', val)
        }
    },
    methods: {
        gotoLastDesktop(): void {
            if (this.currentDesktopIndex > 0)
                --this.currentDesktopIndex
        },
        gotoNextDesktop(): void {
            if (this.currentDesktopIndex < this.desktops.length - 1)
                ++this.currentDesktopIndex
        },
        addDesktop(desktop: DesktopType): void {
            this.desktops.push(desktop)
            this.$el.style.width = `${this.desktops.length * 100}vw`
            const offset = this.desktops.length - this.currentDesktopIndex
            for (let i = 0; i < offset; ++i)
                this.gotoNextDesktop()
        },
        createDesktopIfShould(): DesktopType {
            let { currentDesktop } = this
            if (!currentDesktop) {
                currentDesktop = this.desktops[this.currentDesktopIndex] = { windows: [] }
            }
            return currentDesktop
        },
        translateCurrentWindow(translateWidth: number, callback: () => void): void {
            const { currentWindowRef } = this
            const style = currentWindowRef.$el.style
            if (translateWidth === currentWindowRef.$el.offsetWidth) {
                callback && callback()
            } else {
                afterTransition(currentWindowRef.$el, () => {
                    style.transition = 'none'
                    callback && callback()
                })
                style.transition = 'width 0.3s ease'
                style.width = `${translateWidth}px`
            }
        },
        setCurrentWindowSize(size: number): void {
            const { windows } = this.desktops[this.currentDesktopIndex]
            const movingWindow = windows[windows.length - 1]
            console.assert(windows.length - 1 + movingWindow.size <= MAX_SIZE)

            let sizeToChange = windows.reduce((cur, { size }) => cur + size, 0) + size - movingWindow.size - MAX_SIZE
            for (let i = this.currentWindowIndex - 1; i >= 0; --i) {
                const window = windows[i]
                if (window.size > sizeToChange) {
                    window.size -= sizeToChange
                    break
                } else {
                    sizeToChange -= (window.size - 1)
                    window.size = 1
                }
            }
            movingWindow.size = size
        },
        resetWindowHint(size: number = 0): void {
            this.$refs.windowHint.style.transition = 'none'
            this.windowHintSize = size
        },
        createNewDesktopToFitWindow(): void {
            const currentWindow = this.currentDesktop.windows.pop()
            currentWindow.size = MAX_SIZE
            this.addDesktop({ windows: [currentWindow] })
            this.resetWindowHint(MAX_SIZE)
            this.$refs.windowHint.style.transition = ''
        },
        handleMovingExistingWindow(name: string): void {
            this.currentWindowIndex = this.currentDesktop.windows.findIndex(window => window.title === name)
            if (this.currentWindowIndex !== this.currentDesktop.windows.length - 1) {
                this.currentWindowIndex = -1 // only the last window in desktop is draggable
                return
            }
            this.currentWindow = this.currentDesktop.windows[this.currentWindowIndex]
            this.currentWindow.isMoving = true
            this.lastWindowWidth = this.currentWindowRef.$el.offsetWidth
            this.currentWindowWidth = this.lastWindowWidth
            this.resetWindowHint(this.getWindowSizeByDeltaX(this.lastWindowWidth))
        },
        handleMovingNewWindow({ title, content, color, icon }): void {
            const currentDesktop = this.createDesktopIfShould()
            this.currentWindowIndex = currentDesktop.windows.length
            this.currentWindow = { title, content, color, icon, size: 0, isMoving: true }
            currentDesktop.windows.push(this.currentWindow)
            this.lastWindowWidth = 0
            this.isNewWindow = true
        },
        handleMovingWindow(deltaX: number): void {
            if (this.currentWindowIndex < 0) return
            this.$refs.windowHint.style.transition = ''
            this.currentWindowWidth = Math.max(0, this.lastWindowWidth - deltaX)
            this.windowHintSize = this.getWindowSizeByDeltaX(this.lastWindowWidth - deltaX)
        },
        handleReleaseWindow: function (deltaX: number): void {
            if (!deltaX) return
            const size = this.getWindowSizeByDeltaX(this.lastWindowWidth - deltaX)
            if (this.currentWindowIndex < 0 || !this.currentWindow) return
            if (!size) {
                this.translateCurrentWindow(0, () => {
                    if (!this.isNewWindow) { // restore label
                        const { icon, title, color, content } = this.currentWindow
                        this.windowLabels.push({ icon, title, color, content })
                    }
                    const emptyDesktop = this.currentWindowIndex === 0
                    this.removeCurrentWindow()
                    if (emptyDesktop) this.removeCurrentDesktop()
                    this.windowHintSize = 0
                })
                return
            }

            const { windows } = this.desktops[this.currentDesktopIndex]

            const handleTransitionEnd = () => {
                this.lastWindowWidth = 0
                this.windowHintSize = 0
                this.isNewWindow = false
                this.currentWindow.isMoving = false
            }

            if (this.isNewWindow) // remove label
                this.windowLabels.splice(this.windowLabels.findIndex(label => label.title === this.currentWindow.title), 1)

            if (windows.length === 0 || windows.length - 1 + size > MAX_SIZE) {
                // create a new window
                this.createNewDesktopToFitWindow()
                handleTransitionEnd()
            } else {
                this.translateCurrentWindow(sizeToPX(size), () => {
                    handleTransitionEnd()
                    this.setCurrentWindowSize(size)
                })
            }
        },
        removeCurrentWindow(): void {
            const { windows } = this.currentDesktop
            windows.splice(windows.findIndex(({ title }) => title === this.currentWindow.title), 1)
            this.currentWindow = null
            this.currentWindowIndex = -1
        },
        removeCurrentDesktop(): void {
            this.desktops.splice(this.currentDesktopIndex, 1)
            this.currentDesktopIndex = this.currentDesktopIndex === 0 ? 0 : this.currentDesktopIndex - 1
        },
        getWindowSizeByDeltaX(deltaX) {
            const absDeltaX = Math.abs(deltaX)
            const blockWidth = sizeToPX()
            return Math.min(Math.ceil((absDeltaX - blockWidth / 2) / blockWidth), MAX_SIZE)
        }
    },
    computed: {
        isFirstDesktop(): boolean {
            return this.currentDesktopIndex === 0
        },
        isLastDesktop(): boolean {
            return this.currentDesktopIndex === this.desktops.length - 1
        },
        currentDesktop(): DesktopType {
            return this.desktops[this.currentDesktopIndex]
        },
        currentWindowRef(): any {
            const currentWindowRef = this.$refs.windows.find(({ window: { title } }) => title === this.currentWindow.title)
            console.assert(currentWindowRef)
            return currentWindowRef
        }
    },
    render(h) {
        const {
            desktops,
            windowLabels,
            currentDesktopIndex,
            currentWindow,
            handleMovingNewWindow,
            handleMovingExistingWindow,
            handleMovingWindow,
            handleReleaseWindow,
            gotoLastDesktop,
            gotoNextDesktop,
            isFirstDesktop,
            isLastDesktop,
            windowHintSize
        } = this

        return <div class={styles.desktopManager}>
            {desktops && desktops.map((desktop) => <Desktop>
                {desktop.windows && desktop.windows.map(window =>
                    <Window ref="windows"
                            refInFor={true}
                            window={window}
                            key={window.title}
                            onStartDraggingWindow={handleMovingExistingWindow}
                            onDraggingWindow={handleMovingWindow}
                            onDraggingWindowEnd={handleReleaseWindow}
                            style={!window.isMoving && { flex: window.size }}>{window.content}</Window>)}
            </Desktop>)}
            <div class={styles.fixedUI} style={{ transform: `translateX(${currentDesktopIndex * 100}vw)` }}>
                {<div class={styles.windowHint} ref="windowHint" style={{
                    opacity: (currentWindow && currentWindow.isMoving) ? '' : '0',
                    width: `${sizeToPX(windowHintSize)}px`
                }}/>}
                <div class={styles.windowLabelList}>
                    {windowLabels.map(label => <WindowLabel label={label}
                                                            key={label.title}
                                                            onNewWindow={handleMovingNewWindow}
                                                            onMovingWindow={handleMovingWindow}
                                                            onMovingWindowEnd={handleReleaseWindow}/>)}
                </div>
                {!isFirstDesktop && <Hideable class={styles.toLeftButton} hideFunction={leftButtonHide}>
                    <FloatButton mini
                                 icon="keyboard_arrow_left"
                                 onClick={gotoLastDesktop}/></Hideable>}
                {!isLastDesktop && <Hideable class={styles.toRightButton} hideFunction={rightButtonHide}>
                    <FloatButton mini
                                 icon="keyboard_arrow_right"
                                 onClick={gotoNextDesktop}/></Hideable>}

            </div>
        </div>
    }
}

function leftButtonHide(style) {
    style.transform = 'translateX(-36px)'
}

function rightButtonHide(style) {
    style.transform = 'translateX(36px)'
}
