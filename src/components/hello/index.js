/* @flow */
import Card from '@/ui/card'

function getMessage (i: string): string {
    return i
}

export default {
    name: 'hello',
    components: { Card },
    data () {
        return {
            msg: getMessage('Welcome to zZ\'s Vue.js App'),
            theme: 'Light'
        }
    }
}
