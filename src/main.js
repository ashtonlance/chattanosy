// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import VueFire from 'vuefire'
import App from './App'
import router from './router'
import Input from 'buefy/src/components/input'
import Field from 'buefy/src/components/field'
import 'buefy/lib/buefy.css'
import * as VueGoogleMaps from 'vue2-google-maps'
import miniToastr from 'mini-toastr'
import VueAnalytics from 'vue-analytics'
import VueScrollTo from 'vue-scrollto'
import VuePaginate from 'vue-paginate'

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDni8xEY3eGI6q0ewpUjxYfQyvjJeDbbQo'
  }
})
Vue.use(VueAnalytics, {
  id: 'UA-99566231-2',
  router
})
Vue.use(VueFire)
Vue.component(Input.name, Input)
Vue.component(Field.name, Field)
Vue.use(miniToastr)
Vue.use(VueScrollTo)
Vue.use(VuePaginate)
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
