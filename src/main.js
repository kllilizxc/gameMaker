// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store'

import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'

Vue.use(MuseUI)

Vue.config.productionTip = false

/* eslint-disable no-new */
window.vm0 = new Vue({
    el: '#app',
    // router,
    store,
    template: '<App/>',
    components: { App }
})
