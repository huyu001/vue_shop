import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'; //使用element-ui组件库
import 'element-ui/lib/theme-chalk/index.css';
import router from './router'
import './assets/css/global.css'
import './assets/icons/iconfont.css';
import { Message } from 'element-ui';
import ZkTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor' //导入富文本编辑器
// 导入富文本编辑器样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 导入nprogress js与css
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

//引用配置axois并设置根路径
import axios from 'axios';
axios.defaults.baseURL = 'http://119.23.53.78:8888/api/private/v1/'
Vue.prototype.$http = axios
Vue.prototype.message = Message
    //配置axios拦截器 
    //在每次发送请求前 在请求头中使用 `Authorization` 字段提供 `token` 令牌 授予权限访问
    //很多接口必须授权才能调用
    //发送请求前打开nprogress
axios.interceptors.request.use(config => {
        //为请求头字段添加Authorization字段进行身份验证
        config.headers.Authorization = window.sessionStorage.getItem('token')
            // 打开进度条
        NProgress.start()
        return config
    })
    // 接收响应头中关闭进度条
axios.interceptors.response.use(config => {
    // 关闭进度条
    NProgress.done()
    return config
})

Vue.component('treeTable', ZkTable)
Vue.use(VueQuillEditor) //注册富文本编辑器为全局可用组件
Vue.config.productionTip = false
Vue.use(ElementUI)
    // 全局时间过滤器
Vue.filter('filterTime', function(time) {
    if (!time) {
        return;
    }
    const date = new Date(time)
    const dateNumFun = (num) => num < 10 ? `0${num}` : num
    const [Y, M, D, h, m, s] = [ // es6 解构赋值
                    date.getFullYear(),             dateNumFun(date.getMonth() + 1),             dateNumFun(date.getDate()),             dateNumFun(date.getHours()),             dateNumFun(date.getMinutes()),             dateNumFun(date.getSeconds())    
    ]
    return `${Y}-${M}-${D} ${h}:${m}:${s}` // 一定要注意是反引号，否则无效。
})

new Vue({
    render: h => h(App),
    router
}).$mount('#app')