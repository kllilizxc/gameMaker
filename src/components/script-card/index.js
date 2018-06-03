import styles from './style.css'
import ScriptField from '../script-field'
import Card from '@/ui/card'
import { camelToWords } from '../../common/util'
import DropDown from '@/ui/drop-down'
import IconButton from '@/ui/material-icon-button'

export default {
    functional: true,
    render(h, { props: { script: { name, fields } }, listeners }) {
        return <Card class={styles.scriptCard}>
            <DropDown initFold={false} canFold={!!fields}>
                <div class={styles.title} slot='title' draggable
                     onDragstart={e => listeners.drag({ e, name })}>
                    <div>{camelToWords(name)}</div>
                    <IconButton iconClass={styles.deleteIcon} icon={'cancel'} size={24}
                                onClick={() => listeners.delete(name)}/>
                </div>
                <div slot='content'>
                    {fields && Object.keys(fields).map(fieldName => {
                        const field = { name: fieldName, ...fields[fieldName] }
                        return <div>
                            <ScriptField field={field} key={`${name}:${fieldName}`}
                                         onInput={val => listeners.input({ scriptName: name, ...val })}/>
                        </div>
                    })}
                </div>
            </DropDown>
        </Card>
    }
}
