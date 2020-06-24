import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'


Vue.use(Router)

const router =  new Router({
    routes: [
        { path: '/',component: Login },
        { path: '/login',component: Login },
        { path: '/home',component: Home }
    ]
})

// 路由导航守卫
router.beforeEach((to,from,next) => {
    
    const tokenStr = window.sessionStorage.getItem("token")

    if(to.path == '/login'){
        return next();
    }

    if(!tokenStr){
        return next('/login');
    }

    next();

    
})

export default router