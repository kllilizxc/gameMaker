import styles from './style.css'
import DesktopManager from '@/components/desktop-manager'
import ScriptWindow from '@/components/script-window'

import COLORS from '@/common/colors.css'

export default {
    name: 'app',
    computed: {
        windowLabels() {
            return [
                { icon: 'dashboard', title: 'Inspector', color: COLORS['Grey-50'], content: <ScriptWindow/> },
                { icon: 'face', title: 'face', color: '#9FA8DA' },
                { icon: 'favorite', title: 'favorite', color: '#80DEEA' },
                { icon: 'delete', title: 'delete', color: '#80CBC4' },
                { icon: 'polymer', title: 'polymer', color: '#E6EE9C' }
            ]
        }
    },
    render() {
        let { windowLabels } = this

        return <div id="app">
            <DesktopManager ref="desktopManager" windowLabels={windowLabels}/>
        </div>
    }
}
