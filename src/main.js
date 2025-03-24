import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/iconfont/iconfont.css'
import request from './utils/http'

Vue.use(ElementUI)
Vue.config.productionTip = false

// 将request方法挂载到Vue实例原型链上
Vue.prototype.$http = request

new Vue({
  render: h => h(App),
}).$mount('#app')
