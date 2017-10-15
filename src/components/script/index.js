import styles from './style.css'
import ScriptField, { Option } from '../script-field'
import { readFile } from 'Common/file-manager'

export default {
    props: {
        title: String,
        scripts: Object
    },
    render () {
        let { scripts: { name, func: { fields } } } = this

        return <div class={styles.script}>
            <div class={styles.title}>{name}</div>
            {fields.map(field => <ScriptField option={field}/>)}
        </div>
    }
}
