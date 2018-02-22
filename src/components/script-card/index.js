import styles from './style.css'
import ScriptField from '../script-field'
import Card from '@/ui/card'

export default {
    functional: true,
    render (h, { props: { gameObject, script: { name, Behavior } }, parent: { $store } }) {
        const behavior = new Behavior(gameObject)
        const { fields } = behavior

        return <Card class={styles.scriptCard}>
            <div class={styles.title}>{name}</div>
            {fields.map((field) => <div>
                <ScriptField field={field} onInput={() => $store.dispatch('rerender')}/>
            </div>)}
        </Card>
    }
}
