import Vue from 'vue'
// import { Button } from 'element-ui'
// import { Form, FormItem } from 'element-ui'
// import { Input } from 'element-ui'
// import { Message } from 'element-ui'
// 简写
import {
    Upload,
    checkboxGroup,
    checkbox,
    Steps,
    Step,
    Tabs,
    TabPane,
    Alert,
    Cascader,
    Option,
    Select,
    Tree,
    Tag,
    MessageBox,
    Dialog,
    Pagination,
    Tooltip,
    Switch,
    Table,
    TableColumn,
    Button,
    Form,
    FormItem,
    Input,
    Message,
    Container,
    Header,
    Aside,
    Main,
    menu,
    submenu,
    MenuItemGroup,
    MenuItem,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Row,
    Col
} from 'element-ui'

import Timeline from './timeline/index'
import TimelineItem from './timeline-item/index'

Vue.use(Upload)
Vue.use(checkboxGroup)
Vue.use(checkbox)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Alert)
Vue.use(Cascader)
Vue.use(Option)
Vue.use(Select)
Vue.use(Tree)
Vue.use(Tag)
Vue.use(Dialog)
Vue.use(Pagination)
Vue.use(Tooltip)
Vue.use(Switch)
Vue.use(Table)
Vue.use(TableColumn)
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
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Timeline)
Vue.use(TimelineItem)


// 挂在到vue的原型对象上面
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm


