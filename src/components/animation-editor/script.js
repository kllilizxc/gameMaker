import IconButton from '@/ui/material-icon-button'
import TreeView from '@/components/tree-view'
import Popover from '@/ui/pop-over'
import Menu from '@/ui/menu'
import MenuItem from '@/ui/menu-item'
import { mapGetters } from 'vuex'
import { GROUP_TYPE } from '../script-field'
import styles from './style.css'

export default {
    name: 'animation-editor',
    components: { IconButton, TreeView, Menu, MenuItem, Popover },
    data: () => ({
        duration: 5,
        interval: 0.2,
        bigNumberLength: 100,
        keys: {},
        isRecording: false,
        isPlaying: false,
        addMenuTrigger: null,
        addMenuIsOpen: false,
        chosenFrame: { x: -1, y: -1 },
        chosenX: 0,
        keyArray: []
    }),
    computed: {
        ...mapGetters(['gameObject']),
        fieldsData() {
            if (!this.gameObject) return []
            const { scripts } = this.gameObject
            return Object.keys(scripts).map(name => { // scripts
                const { fields } = scripts[name]
                const fieldsArray = fields && Object.keys(fields).map(fieldName => { // fields
                    const field = fields[fieldName]
                    if (field.type === GROUP_TYPE)
                        return {
                            name: fieldName,
                            children: Object.keys(field.children).map(childName => { // group
                                const child = field.children[childName]
                                return { name: childName, get: child.get, set: child.set }
                            })
                        }
                    else
                        return { name: fieldName, get: field.get, set: field.set }
                })
                return { name, children: fieldsArray }
            }).filter(f => f.children)
        },
        smallNumberLength() {
            return this.bigNumberLength / (1 / this.interval)
        },
        totalNumberLength() {
            return this.duration * 1 / this.interval
        }
    },
    created() {
    },
    mounted() {
        this.addMenuTrigger = this.$refs.addButton.$el
        this.makeDraggable(this.$refs.svg)
    },
    methods: {
        toggleRecording() {
            this.isRecording = !this.isRecording
        },
        togglePlaying() {
            this.isPlaying = !this.isPlaying
        },
        openAddMenu() {
            this.addMenuIsOpen = !this.addMenuIsOpen
        },
        handleAddMenuClose() {
            this.addMenuIsOpen = false
        },
        setKeyArray() {
            this.keyArray = Object.keys(this.keys)
        },
        addKey(...names) {
            const keyName = names.join('.')
            this.addFrame(keyName, 0, this.getKeyValue(keyName))
            this.handleAddMenuClose()
        },
        getKeyValue(keyName) {
            const names = keyName.split('.')
            let keyValue = this.gameObject[names[0]].fields[names[1]]
            if (names[2]) keyValue = keyValue.children[names[2]]
            keyValue = keyValue.get()
            return keyValue
        },
        addFrame(name, timestamp, value) {
            if (!this.keys[name]) {
                this.keys[name] = {}
                this.setKeyArray()
            }
            this.keys[name][timestamp] = value
            this.$forceUpdate()
        },
        getTimestampOfFrame(x) {
            return parseInt((x - 1) * this.interval * 1000)
        },
        getKeyNameOfFrame(y) {
            return this.keyArray[y - 1]
        },
        frameIsSet(x, y) {
            const key = this.keys[this.getKeyNameOfFrame(y)]
            return key && key[this.getTimestampOfFrame(x)] !== undefined
        },
        frameIsChosen(x, y) {
            return this.chosenFrame.x === x && this.chosenFrame.y === y
        },
        setChosenFrame(x = -1, y = -1) {
            this.chosenFrame.x = x
            this.chosenFrame.y = y
        },
        setOrChoseFrame(x, y) {
            if (this.frameIsSet(x, y)) {
                // chose frame
                this.setChosenFrame(x, y)
            } else {
                // set frame
                const keyName = this.getKeyNameOfFrame(y)
                const timestamp = this.getTimestampOfFrame(x)
                const value = this.getKeyValue(keyName)
                this.addFrame(keyName, timestamp, value)
            }
        },
        removeFrame(x, y) {
            const keyName = this.getKeyNameOfFrame(y)
            const timestamp = this.getTimestampOfFrame(x)
            delete this.keys[keyName][timestamp]
            this.setChosenFrame()
            this.$forceUpdate()
        },
        moveFrame(x, y, newX) {
            const keyName = this.getKeyNameOfFrame(y)
            const timestamp = this.getTimestampOfFrame(x)
            const newTimestamp = this.getTimestampOfFrame(newX)
            const key = this.keys[keyName]
            const value = key[timestamp]
            delete key[timestamp]
            key[newTimestamp] = value
            this.$forceUpdate()
        },
        isChosenX(x) {
            return x === this.chosenX
        },
        choseX(x) {
            this.chosenX = x
            this.$refs.indicator.setAttributeNS(null, 'x1', x)
            this.$refs.indicator.setAttributeNS(null, 'x2', x)
        },
        makeDraggable(svg) {
            let selectedElement, lastX
            svg.addEventListener('mousedown', startDrag)
            svg.addEventListener('mousemove', drag)
            svg.addEventListener('mouseup', endDrag)
            svg.addEventListener('mouseleave', endDrag)

            const { moveFrame, smallNumberLength, choseX } = this

            function getMousePosition(e) {
                const CTM = svg.getScreenCTM()
                return (e.clientX - CTM.e) / CTM.a
            }

            function startDrag(e) {
                selectedElement = e.target
                if (!selectedElement.classList.contains(styles.setFrame))
                    selectedElement = null
            }

            function drag(e) {
                if (selectedElement) {
                    e.preventDefault()
                    const pos = getMousePosition(e)
                    const newX = Math.round(pos / smallNumberLength)
                    let { x, y } = selectedElement.dataset
                    x = lastX === undefined ? x : lastX
                    if (+x !== newX) {
                        if (selectedElement.classList.contains(styles.indicator))
                            choseX(newX)
                        else
                            moveFrame(+x, +y, newX)
                        lastX = newX
                    }
                }
            }

            function endDrag() {
                selectedElement = null
            }
        }
    }
}

