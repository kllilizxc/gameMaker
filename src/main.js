// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store'

import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
import theme from 'muse-ui/lib/theme'

Vue.use(MuseUI)
theme.add('candy', {
    primary: '#58323d',
    secondary: '#c06c84',
    success: '#4caf50',
    warning: '#ffeb3b'
}, 'light')

theme.use('candy')

Vue.config.productionTip = false
Vue.config.performance = true

/* eslint-disable no-new */
window.vm0 = new Vue({
    el: '#app',
    // router,
    store,
    template: '<App/>',
    components: { App }
})
//
