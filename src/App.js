import styles from './style.css'
import DesktopManager from '@/components/desktop-manager'
import ScriptWindow from '@/components/script-window'
import SceneWindow from '@/components/scene-window'

import COLORS from '@/common/colors.css'

export default {
    name: 'app',
    computed: {
        windowLabels() {
            return [
                { icon: 'dashboard', title: 'Inspector', color: COLORS['Grey-50'], content: <ScriptWindow/> },
                { icon: 'subject', title: 'Scene', color: COLORS['Grey-100'], content: <SceneWindow/> },
                { icon: 'favorite', title: 'favorite', color: '#80DEEA' },
                { icon: 'delete', title: 'delete', color: '#80CBC4' },
                { icon: 'polymer', title: 'polymer', color: '#E6EE9C' }
            ]
        }
    },
    render() {
        const { windowLabels } = this

        return <div id="app">
            <DesktopManager ref="desktopManager" windowLabels={windowLabels}/>
        </div>
    }
}
