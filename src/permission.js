/**
 * 全站权限配置
 */
import router from './router/router'
import store from '@/store'
import {validatenull} from '@/util/validate'
import {resetRouter} from '@/router/router'
import {Message} from "element-ui";
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
NProgress.configure({showSpinner: false})
const lockPage = store.getters.website.lockPage // 锁屏页
router.beforeEach((to, from, next) => {
    // 缓冲设置
    if (to.meta.keepAlive === true && store.state.tags.tagList.some(ele => {})) {
        to.meta.$keepAlive = true
    } else {
        NProgress.start()
        if (to.meta.keepAlive === true && validatenull(to.meta.$keepAlive)) {
            to.meta.$keepAlive = true
        } else {
            to.meta.$keepAlive = false
        }
    }
    const meta = to.meta || {}
    const token=store.getters.permissionToken
    if (token.access_token) {
        if (store.getters.isLock && to.path !== lockPage) {
            next({path: lockPage})
        } else if (to.path === '/login') {
            next({path: '/'})
        } else {
            //todo 退出情况在此判断,roles[]为0，请求userInfo
            const value = to.query.src || to.fullPath
            const label = to.query.name || to.name
            if (meta.isTab !== false && !validatenull(value) && !validatenull(label)) {
                store.commit('ADD_TAG', {
                    label: label,
                    value: value,
                    params: to.params,
                    query: to.query,
                    group: router.$avueRouter.group || []
                })
            }
            const menus=store.getters.menus
            const currentMenuModelId=store.getters.currentMenuModelId
            const isMenuRefresh=store.getters.isMenuRefresh
            if(!menus){
                store.dispatch("GetUserInfo").then(data=>{
                    !currentMenuModelId && store.commit('SET_CURRENT_MODELID',data.usermodel[0])
                    if(data.usermodel.length && data.groupIds.length){
                        store.dispatch("GetMenu",{modelId:currentMenuModelId || data.usermodel[0]}).then(menus => {
                            if(!menus.length){
                                store.dispatch('FedLogOut')
                                Message.error("账户没有权限，请联系管理员！");
                                next('login')
                            }else {
                                router.$avueRouter.formatRoutes(menus, true);
                                store.dispatch("GetModels",data)
                                store.dispatch("GetUsers")
                                next()
                            }
                        })
                    }else {
                        store.dispatch('FedLogOut')
                        Message.error("账户未激活，请联系管理员！");
                        next('login')
                    }
                })
            }else {
                if(isMenuRefresh && menus.length){
                    resetRouter()
                    router.$avueRouter.formatRoutes(menus, true);
                    store.commit('exclude/CHANGE_MENU_REFRESH_STATE',false)
                    next({...to})
                }else{
                    next()
                }
            }
            // console.log(router)
        }
    } else {
        if (meta.isAuth === false) {
            next()
        } else {
            next('/login')
        }
    }
})

router.afterEach(() => {
    NProgress.done()
    const title = store.getters.tag.label
    router.$avueRouter.setTitle(title)
})
