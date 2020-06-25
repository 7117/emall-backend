import Vue from 'vue'
// import { Button } from 'element-ui'
// import { Form, FormItem } from 'element-ui'
// import { Input } from 'element-ui'
// import { Message } from 'element-ui'
// 简写
import {
    Button,Form,FormItem,Input,Message,Container,Header,Aside,Main,menu,submenu,MenuItemGroup,MenuItem
} from 'element-ui'


Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(menu)
Vue.use(submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)

// 挂在到vue的原型对象上面
Vue.prototype.$message = Message


