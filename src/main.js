import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'; //使用element-ui组件库
import 'element-ui/lib/theme-chalk/index.css';
import router from './router'
import './assets/css/global.css'
import './assets/icons/iconfont.css';
import { Message } from 'element-ui';
//引用配置axois并设置根路径
import axios from 'axios';
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios
Vue.prototype.message = Message
    //配置axios拦截器 
    //在每次发送请求前 在请求头中使用 `Authorization` 字段提供 `token` 令牌 授予权限访问
    //很多接口必须授权才能调用
axios.interceptors.request.use(config => {
    //为请求头字段添加Authorization字段进行身份验证
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})

Vue.config.productionTip = false
Vue.use(ElementUI)

new Vue({
    render: h => h(App),
    router
}).$mount('#app')