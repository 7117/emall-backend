import Vue from 'vue'
import Router from 'vue-router'
// import Login from './components/Login.vue'
// import Home from './components/Home.vue'
// import Welcome from './components/Welcome.vue'
// import Users from './components/user/Users.vue'
// import Rights from './components/power/Rights'
// import Roles from './components/power/Roles.vue'
// import Cate from './components/goods/Cate.vue'
// import Params from "./components/goods/Params.vue";
// import List from "./components/goods/List.vue";
// import Add from "./components/goods/Add.vue";
// import Order from "./components/order/Order.vue";
// import Report from "./components/report/Report.vue";
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ './components/Login.vue')
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ './components/Home.vue')
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ './components/Welcome.vue')

const Users = () => import(/* webpackChunkName: "Users_Rights_Roles" */ './components/user/Users.vue')
const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ './components/power/Rights')
const Roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ './components/power/Roles.vue')

const Cate = () => import(/* webpackChunkName: "Cate_Params" */ './components/goods/Cate.vue')
const Params = () => import(/* webpackChunkName: "Cate_Params" */ './components/goods/Params.vue')

const List = () => import(/* webpackChunkName: "List_Add" */ './components/goods/List.vue')
const Add = () => import(/* webpackChunkName: "List_Add" */ './components/goods/Add.vue')

const Order = () => import(/* webpackChunkName: "Order_Report" */ './components/order/Order.vue')
const Report = () => import(/* webpackChunkName: "Order_Report" */ './components/report/Report.vue')


Vue.use(Router)

const router = new Router({
    routes: [
        {path: '/login', component: Login},
        {
            path: '/home',
            component: Home,
            redirect: '/welcome',
            children: [
                {path: '/welcome', component: Welcome},
                {path: '/users', component: Users},
                {path: '/rights', component: Rights},
                {path: '/categories', component: Cate},
                {path: '/params', component: Params},
                {path: '/roles', component: Roles},
                {path: '/goods', component: List},
                {path: '/goods/add', component: Add},
                {path: '/orders', component: Order},
                {path: '/reports', component: Report},
            ]
        },
    ]
})

// 路由导航守卫
router.beforeEach((to, from, next) => {

    const tokenStr = window.sessionStorage.getItem("token")

    if (to.path == '/login') {
        return next();
    }
    if (!tokenStr) {
        return next('/login');
    }
    next();
})

export default router