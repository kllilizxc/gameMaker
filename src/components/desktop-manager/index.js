// @flow
import styles from './style.css'
import Desktop from '@/components/desktop'
import Window from '@/components/window'
import FloatButton from '@/ui/float-button'
import Hideable from '@/ui/hideable'
import WindowLabel from '@/components/window-label'
import { afterTransition } from '../../common/util'

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
    data: () => ({
        desktops: [{ windows: [{ title: 'placeholder', color: '#fff', size: 4 }] }],
        currentDesktopIndex: 0,
        currentWindowIndex: 0,
        windowHintSize: 0,
        lastWindowWidth: 0,
        currentWindowWidth: 0,
        currentWindow: null,
        isNewWindow: false,
        windowLabels: [
            { icon: 'dashboard', title: 'dashboard', color: '#EF9A9A' },
            { icon: 'face', title: 'face', color: '#9FA8DA' },
            { icon: 'favorite', title: 'favorite', color: '#80DEEA' },
            { icon: 'delete', title: 'delete', color: '#80CBC4' },
            { icon: 'polymer', title: 'polymer', color: '#E6EE9C' }
        ]
    }),
    watch: {
        currentDesktopIndex(index: number): void {
            if (this.$el && this.$el.style)
                this.$el.style.transform = `translateX(${-100 * index}vw)`
        },
        currentWindowWidth(val) {
            this.currentWindowRef.$el.style.width = val + 'px'
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

            let sizeToReduce = windows.reduce((cur, { size }) => cur + size, 0) + size - movingWindow.size - MAX_SIZE
            for (let i = windows.length - 2; i >= 0 && sizeToReduce > 0; --i) {
                const window = windows[i]
                if (window.size >= sizeToReduce + 1) {
                    window.size -= sizeToReduce
                    break
                } else {
                    sizeToReduce -= (window.size - 1)
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
            const { currentWindow } = this
            currentWindow.size = MAX_SIZE
            this.currentDesktop.windows.pop()
            this.resetWindowHint()
            this.addDesktop({ windows: [currentWindow] })
            this.$refs.windowHint.style.transition = ''
        },
        handleMovingExistingWindow(name: string): void {
            this.currentWindowIndex = this.currentDesktop.windows.findIndex(window => window.title === name)
            if (this.currentWindowIndex === 0 || this.currentWindowIndex !== this.currentDesktop.windows.length - 1) {
                this.currentWindowIndex = -1 // only the last window while not being the first window in desktop is draggable
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
            const size = this.getWindowSizeByDeltaX(this.lastWindowWidth - deltaX)
            if (this.currentWindowIndex < 0 || !this.currentWindow) return
            if (!size) {
                this.translateCurrentWindow(0, () => {
                    if (!this.isNewWindow) { // restore label
                        const { icon, title, color } = this.currentWindow
                        this.windowLabels.push({ icon, title, color })
                    }
                    this.removeCurrentWindow()
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
            windows.splice(windows.findIndex(({ title }) => title === this.currentWindow.title))
            this.currentWindow = null
            this.currentWindowIndex = -1
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
            return this.$refs.windows.find(({ title }) => title === this.currentWindow.title)
        }
    },
    render() {
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
            {desktops && desktops.map((desktop, index) => <Desktop>
                {desktop.windows && desktop.windows.map(window =>
                    <Window ref="windows"
                            refInFor={true}
                            title={window.title}
                            key={window.title}
                            color={window.color}
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
                    {windowLabels.map(label => <WindowLabel icon={label.icon}
                                                            title={label.title}
                                                            color={label.color}
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
    style.transform = 'translateX(-50px)'
}

function rightButtonHide(style) {
    style.transform = 'translateX(50px)'
}
