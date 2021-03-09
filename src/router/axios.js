import Vue from 'vue'
import Config from '@/config/cms'
import {serialize} from '@/util/util'
import NProgress from 'nprogress' // progress bar
import ErrorCode from '@/config/error-code'
import router from '@/router/router'
import {Message} from 'element-ui'
import 'nprogress/nprogress.css'
import qs from 'qs'
import store from '@/store' // progress bar style
//todo 新增配置baseUrl
const hostname=window.location.hostname
if(['localhost'].includes(hostname)){
    window.baseURL='http://localhost:5000'
}
axios.defaults.baseURL = window.baseURL
axios.defaults.timeout = 1000*120
axios.defaults.withCredentials =true
// 返回其他状态吗
axios.defaults.validateStatus = function (status) {
    return status >= 200 && status <= 500 // 默认的
}
// NProgress Configuration
NProgress.configure({
    showSpinner: false
})

// HTTPrequest拦截
axios.interceptors.request.use(config => {
    NProgress.start() // start progress bar
    // 有 API 请求重新计时
    Vue.prototype.$_jump()
    store.commit('exclude/SET_REQUEST_LOADING', true)
    const reqConfig = {...config}
    const token = store.getters.permissionToken
    const modelId = store.getters.currentMenuModelId
    // 参数容错
    if (reqConfig.method === 'get') {
        if (!reqConfig.params) {
            // 防止字段用错
            reqConfig.params = reqConfig.data || {}
        }
        Object.assign(reqConfig.params,{modelId})
    } else if (['post','delete','put'].includes(reqConfig.method)) {
        if (!reqConfig.data) {
            // 防止字段用错
            reqConfig.data = reqConfig.params || {}
        }
        Object.assign(reqConfig.data,{modelId})
        // 检测是否包含文件类型, 若包含则进行 formData 封装
        if(reqConfig.method==='post'){
            let hasFile = false
            Object.keys(reqConfig.data).forEach(key => {
                if (typeof reqConfig.data[key] === 'object') {
                    const item = reqConfig.data[key]
                    if (item instanceof FileList || item instanceof File || item instanceof Blob) {
                        hasFile = true
                    }
                }
            })
            // 检测到存在文件使用 FormData 提交数据
            if (hasFile) {
                console.log(reqConfig.data,'reqConfig.data')
                const formData = new FormData()
                Object.keys(reqConfig.data).forEach(key => {
                    formData.append(key, reqConfig.data[key])
                })
                reqConfig.data = formData
            }
        }
    }
    // step2: permission 处理
    if (reqConfig.url === 'cms/user/refresh') {
        const refreshToken = token.refresh_token
        if (refreshToken) {
            reqConfig.headers.Authorization = refreshToken
        }
    } else {
        // 有access_token
        const accessToken = token.access_token
        if (accessToken) {
            reqConfig.headers.Authorization = accessToken
        }
    }
    return reqConfig
}, error => {
    store.commit('exclude/SET_REQUEST_LOADING', false)
    return Promise.reject(error)
})

// HTTPresponse拦截
axios.interceptors.response.use(res => {
    NProgress.done()
    store.commit('exclude/SET_REQUEST_LOADING', false)
    if (res.status.toString().charAt(0) === '2') {
        return res.data
    }
    let {code, message} = res.data // eslint-disable-line
    // const res=response.data
    return new Promise(async (resolve, reject) => {
        const {url} = res.config
        // refreshToken相关，直接登出
        if (code === 10000 || code === 10042 || code === 10052 || code === 10051) {
            store.dispatch('FedLogOut').then(res=>{
                window.location.reload()
            })
            return resolve(null)
        }
        // assessToken相关，刷新令牌
        if (code === 10041 || code === 10051 ||code === 10050) {
            const cache = {}
            if (cache.url !== url) {
                cache.url = url
                const refreshResult = await axios('cms/user/refresh')
                store.commit('SET_TOKEN',{access_token:refreshResult.access_token})
                // 将上次失败请求重发
                const result = await axios(res.config)
                return resolve(result)
            }
        }
        // 第一种情况：默认直接提示后端返回的异常信息；特殊情况：如果本次请求添加了 handleError: true，用户自己try catch，框架不做处理
        if (res.config.handleError) {
            return reject(res)
        }
        // 第二种情况：采用前端自己的一套异常提示信息；特殊情况：如果本次请求添加了 showBackend: true, 弹出后端返回错误信息。
        if (Config.useFrontEndErrorMsg && !res.config.showBackend) {
            // 弹出前端自定义错误信息
            const errorArr = Object.entries(ErrorCode).filter(v => v[0] === code.toString())
            // 匹配到前端自定义的错误码
            if (errorArr.length > 0 && errorArr[0][1] !== '') {
                message = errorArr[0][1]
            } else {
                message = ErrorCode['999']
            }
        }
        !message && (message=ErrorCode['default'])
        Vue.prototype.$message({
            message,
            type: 'error',
        })
        reject()
    })
}, error => {
    NProgress.done()
    store.commit('exclude/SET_REQUEST_LOADING', false)
    if (!error.response) {
        Vue.prototype.$notify({
            title: 'Network Error',
            dangerouslyUseHTMLString: true,
            message: '<strong class="my-notify">请检查 API 是否异常</strong>',
        })
    }
    
    // 判断请求超时
    if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
        Vue.prototype.$message({
            type: 'warning',
            message: '请求超时',
        })
    }
    return Promise.reject(error)
})
// 导出常用函数

/**
 * @param {string} url
 * @param {object} data
 * @param {object} params
 * options{object} {handleError:false,showBackend:true}
 */
const defaultOptionsConfig={handleError:false,showBackend:true}
export function apiPost(url, data = {}, params = {},options=defaultOptionsConfig) {
    return axios({
        method: 'post',
        url,
        data,
        params,
        ...options
    })
}

/**
 * @param {string} url
 * @param {object} params
 */
export function apiGet(url, params = {},options=defaultOptionsConfig) {
    return axios({
        method: 'get',
        url,
        params,
        ...options
    })
}

/**
 * @param {string} url
 * @param {object} data
 * @param {object} params
 */
export function apiPut(url, data = {}, params = {},options=defaultOptionsConfig) {
    return axios({
        method: 'put',
        url,
        data,
        params,
        ...options
    })
}

/**
 * @param {string} url
 * @param {object} params
 */
export function apiDelete(url, params = {},options=defaultOptionsConfig) {
    return axios({
        method: 'delete',
        url,
        params,
        ...options
    })
}

export default axios
