// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import VueFire from 'vuefire'
import App from './App'
import router from './router'
import Buefy from 'buefy'
import 'buefy/lib/buefy.css'
import * as VueGoogleMaps from 'vue2-google-maps'
import miniToastr from 'mini-toastr'

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDni8xEY3eGI6q0ewpUjxYfQyvjJeDbbQo'
  }
})

Vue.use(VueFire)
Vue.use(Buefy)
Vue.use(miniToastr)
Vue.config.productionTip = false

/* eslint-disable no-new */

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {
    App
  }
})
