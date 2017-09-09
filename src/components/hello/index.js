// @flow
import Card from '@/ui/card'
import Window from '@/components/window'

function getMessage(i: string): string {
    return i
}

export default {
    name: 'hello',
    components: { Card, Window },
    data() {
        return {
            msg: getMessage('Welcome to zZ\'s Vue.js App'),
            theme: 'Light'
        }
    }
}
