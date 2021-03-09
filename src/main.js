import 'babel-polyfill'
import 'classlist-polyfill'
import Vue from 'vue'
import {Axios} from './router/axios'
import VueAxios from 'vue-axios'
import App from './App'
import './permission' // 权限
import './error' // 日志
import '@/plugin'
import router from './router/router'
import store from './store'
import { loadStyle } from './util/util'
import * as urls from '@/config/env'
import { iconfontUrl, iconfontVersion } from '@/config/env'
import * as filters from './filters' // 全局filter
import './styles/common.scss'
import xss from 'xss'
Vue.use(AvueFormDesign);
import basicContainer from './components/basic-container/main'
// 插件 json 展示
Vue.use(router)

Vue.use(VueAxios, axios)
//todo 全局mixin
import SystemMixin from '@/mixins/system'
Vue.mixin(SystemMixin)
Vue.prototype.baseURL=window.baseURL
Vue.prototype.$xss=xss
// '.jpg,.jpeg,.bmp,.png,.gif'
Vue.prototype.uploadConfig={
    listType: 'picture-img',
    loadText: '上传中...',
    data:{modelId:store.getters.currentMenuModelId},
    accept:'image/*',
    action: `/cms/file`,
}
import  hljs from 'highlight.js'
import 'highlight.js/styles/googlecode.css'

Vue.directive('highlight',el=>{
    const highlightEls = el.querySelectorAll('code,pre')
    highlightEls.forEach(block=>{
        block && hljs.highlightBlock(block)
    })
})

Vue.use(MavonEditor)

Vue.use(window.AVUE)

// 注册全局容器
Vue.component('basicContainer', basicContainer)
// 加载相关url地址
Object.keys(urls).forEach(key => {
  Vue.prototype[key] = urls[key]
})

// 加载过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// 动态加载阿里云字体库
iconfontVersion.forEach(ele => {
  loadStyle(iconfontUrl.replace('$key', ele))
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
