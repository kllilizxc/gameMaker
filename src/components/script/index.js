import styles from './style.css'
import ScriptField, { Option } from '../script-field'

export default {
    props: {
        title: String,
        filePath: String
    },
    computed: {
        fields(): Array<Option> {
            import behavior, { annotations } fromthis.filePath
            return []
        }
    },
    render() {
        let { title, fields } = this

        return <div class={styles.script}>
            <div class={styles.title}>{title}</div>
                {fields.map(field => <ScriptField option={field}/>)}
            </div>
    }
}
