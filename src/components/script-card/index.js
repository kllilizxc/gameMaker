import styles from './style.css'
import ScriptField from '../script-field'
import Card from '@/ui/card'
import * as BABYLON from 'babylonjs'

export default {
    functional: true,
    render (h, { props: { script: { name, Behavior } }, parent: { $store: { getters: { gameObject } } } }) {
        const behavior = new Behavior(BABYLON, gameObject)
        const { fields } = behavior

        return <Card class={styles.scriptCard}>
            <div class={styles.title}>{name}</div>
            {fields && fields.map((field) => <div>
                <ScriptField field={field}/>
            </div>)}
        </Card>
    }
}
