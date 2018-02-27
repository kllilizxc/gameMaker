import styles from './style.css'
import ScriptField from '../script-field'
import Card from '@/ui/card'

export default {
    functional: true,
    render (h, { props: { gameObject, script: { name, Behavior } } }) {
        const behavior = new Behavior(THREE, gameObject)
        const { fields, update } = behavior

        return <Card class={styles.scriptCard}>
            <div class={styles.title}>{name}</div>
            {fields.map((field) => <div>
                <ScriptField field={field} onInput={update}/>
            </div>)}
        </Card>
    }
}
