import Vue from 'vue'
import Router from 'vue-router'
import testFile from '@/components/testfile'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'testFile',
      component: testFile
    }
  ]
})
