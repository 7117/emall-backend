import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
import 'quill/dist/quill.bubble.css' // for bubble theme


Vue.use(VueQuillEditor, /* { default global options } */)
// 导入axios
import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.prototype.$http = axios

Vue.config.productionTip = false
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 挂载到vue的原型对象上面 通过this直接访问$http  从而发起ajax的请求
axios.interceptors.request.use(config => {
    //展示进度条
    NProgress.start()
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})

axios.interceptors.response.use(config => {
    //隐藏进度条
    NProgress.done()
    return config
})

Vue.component('tree-table', TreeTable)

Vue.filter('dataFormat', function (origiVal) {
    const dt = new Date(origiVal)
    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + '').padStart(2, '0')

    const hh = (dt.getHours() + '').padStart(2, '0')
    const mm = (dt.getMinutes() + '').padStart(2, '0')
    const ss = (dt.getSeconds() + '').padStart(2, '0')

    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`

})

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
