import styles from './style.css'
import IconButton from '@/ui/material-icon-button'
import TreeView from '@/components/tree-view'
import { mapGetters } from 'vuex'
import { GROUP_TYPE } from '../script-field'

export default {
    name: 'animation-editor',
    data: () => ({
        duration: 5,
        minInterval: 0.1,
        keys: [],
        isRecording: false,
        isPlaying: false
    }),
    computed: {
        ...mapGetters(['gameObject']),
        fieldsData() {
            const { scripts } = this.gameObjects
            return Object.keys(scripts).map(name => { // scripts
                const fields = scripts[name]
                const fieldsArray = Object.keys(fields).map(fieldName => { // fields
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
        }
    },
    created() {
    },
    mounted() {
    },
    methods: {
        toggleRecording() {
            this.isRecording = !this.isRecording
        },
        togglePlaying() {
            this.isPlaying = !this.isPlaying
        }
    },
    render() {
        const { isRcording, togglePlaying, toggleRecording, fieldsData } = this

        return <div class={styles.animationEditor}>
            <div class={styles.leftPanel}>
                <div class={styles.toolBar}>
                    <IconButton icon='fiber_manual_record' size={24} class={{ [styles.recording]: isRcording }}
                                onClick={toggleRecording}/>
                    <IconButton icon='play_arrow' size={24} onClick={togglePlaying}/>
                </div>
                <TreeView class={styles.fields}
                          data={fieldsData}
                          getIdFunction={i => i.name}
                          haveChildrenFunction={i => i.children}
                          getChildrenFunction={i => i.children}
                          renderItemFunction={i => i.name}/>
            </div>
            <div class={styles.rightPanel}>
                <div class={styles.timeline}></div>
                <div class={styles.keyContainer}></div>
            </div>
        </div>
    }
}
