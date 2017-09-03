/* @flow */

function getMessage (i: string): string {
    return i
}

export default {
    name: 'hello',
    data () {
        return {
            msg: getMessage('Welcome to zZ\'s Vue.js App'),
            theme: 'Light'
        }
    }
}
