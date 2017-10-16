import styles from './style.css'
import ScriptField from '../script-field'
import Card from '@/ui/card'
import Divider from '@/ui/divider'

export default {
    functional: true,
    render (h, { props: { script: { name, Behavior } } }) {
        let behavior = new Behavior()
        let { fields, update } = behavior

        return <Card class={styles.scriptCard}>
            <div class={styles.title}>{name}</div>
            {fields.map((field, index) => <div>
                <ScriptField field={field} onInput={update}/>
            </div>)}
        </Card>
    }
}
