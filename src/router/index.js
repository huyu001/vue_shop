import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home';
Vue.use(Router)
const router = new Router({
        routes: [{
                path: '/',
                redirect: '/login'
            },
            {
                path: '/login',
                component: Login
            }, {
                path: '/home',
                component: Home
            }
        ]
    })
    //路由导航守卫
router.beforeEach((to, from, next) => {
    // to 为要跳转的页面
    //from为从那个页面跳转而来
    //next()放行 去往to地址 next('/aa')强制去往aa地址
    if (to.path == '/login') {
        return next()
    }
    var tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) {
        return next('/login')
    } else {
        next()
    }

})
export default router