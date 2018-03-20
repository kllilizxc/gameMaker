import styles from './style.css'
import ScriptField from '../script-field'
import Card from '@/ui/card'

export default {
    functional: true,
    render(h, { props: { script: { name, fields } } }) {
        return <Card class={styles.scriptCard}>
            <div class={styles.title}>{name}</div>
            {fields && fields.map((field) => <div>
                <ScriptField field={field}/>
            </div>)}
        </Card>
    }
}
