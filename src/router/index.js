import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import Users from '../components/users/Users';
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
                component: Home,
                redirect: '/welcome', //访问home页面 自动重定向到welcome
                children: [{
                    path: '/welcome',
                    component: Welcome
                }, {
                    path: '/user',
                    component: Users
                }]
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
    //获取本地是否有token 有则可以直接访问需要权限的页面
    //没有则强行跳转到登录页
    var tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) {
        return next('/login')
    } else {
        next()
    }

})
export default router