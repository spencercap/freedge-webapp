// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import vueSmoothScroll from 'vue-smooth-scroll'
// import router from './router'

Vue.config.productionTip = false
Vue.config.devtools = true
Vue.use(vueSmoothScroll)
Vue.use(require('vue-moment'))

// var vm = new Vue({
/* eslint-disable no-new */
new Vue({
  el: '#app',
  // router,
  template: '<App/>',
  components: { App }
})

// document.getElementById("dtpckr").addEventListener("blur", function() {
//   console.log('blurrrrred')
// })
