import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'; //使用element-ui组件库
import 'element-ui/lib/theme-chalk/index.css';
import router from './router'
import './assets/css/global.css'
import { Message } from 'element-ui';
//引用配置axois并设置根路径
import axios from 'axios';
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios
Vue.prototype.message = Message

Vue.config.productionTip = false
Vue.use(ElementUI)

new Vue({
    render: h => h(App),
    router
}).$mount('#app')