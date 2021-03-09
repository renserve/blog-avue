const RouterPlugin = function () {
    this.$router = null
    this.$store = null
}
import {getCookie} from "@/util/cookie";

const websiteTitle = getCookie('website_name')
RouterPlugin.install = function (router, store) {
    this.$router = router
    this.$store = store
    
    function isURL(s) {
        return /^http[s]?:\/\/.*/.test(s)
    }
    
    function objToform(obj) {
        const result = []
        Object.keys(obj).forEach(ele => {
            result.push(`${ele}=${obj[ele]}`)
        })
        return result.join('&')
    }
    
    this.$router.$avueRouter = {
        // 全局配置
        $website: this.$store.getters.website,
        $defaultTitle: websiteTitle || defaultTitle,
        routerList: [],
        group: '',
        safe: this,
        // 设置标题
        setTitle: function (title) {
            title = title ? `${title}—${this.$defaultTitle}` : this.$defaultTitle
            document.title = title
        },
        closeTag: (value) => {
            const tag = value || this.$store.getters.tag
            this.$store.commit('DEL_TAG', tag)
        },
        // 处理路由
        getPath: function (params) {
            const {src} = params
            let result = src || '/'
            if (src.includes('http') || src.includes('https')) {
                result = `/myiframe/urlPath?${objToform(params)}`
            }
            return result
        },
        // 正则处理路由
        vaildPath: function (list, path) {
            let result = false
            list.forEach(ele => {
                if (new RegExp('^' + ele + '.*', 'g').test(path)) {
                    result = true
                }
            })
            return result
        },
        // 设置路由值
        getValue: function (route) {
            let value = ''
            if (route.query.src) {
                value = route.query.src
            } else {
                value = route.path
            }
            return value
        },
        // 动态路由
        formatRoutes: function (aMenu = [], first) {
            const aRouter = []
            const propsConfig = this.$website.menu.props
            const propsDefault = {
                name: propsConfig.label,
                path: propsConfig.path,
                component: propsConfig.component,
                icon: propsConfig.icon,
                children: propsConfig.children,
                meta: propsConfig.meta,
            }
            if (aMenu.length === 0) return
             for (let i = 0; i < aMenu.length; i++) {
                const oMenu = aMenu[i]
                if (this.routerList.includes(oMenu[propsDefault.path])) return
                const path = (() => {
                    if (!oMenu[propsDefault.path]) {
                        return
                    } else if (first) {
                        return oMenu[propsDefault.path].replace('/index', '')
                    } else {
                        return oMenu[propsDefault.path]
                    }
                })()
                
                //特殊处理组件
                //oMenu.path ===propsDefault.path ===propsDefault.component
                const component = 'views' + oMenu[propsDefault.component]
                
                const name = oMenu[propsDefault.name]
            
                const icon = oMenu[propsDefault.icon]
                
                const children = oMenu[propsDefault.children]
                
                const meta = {
                    permissionCode:oMenu.permissionCode,
                    keepAlive: Number(oMenu['keepAlive']) === 0
                }
                const isChild = children && children.length !== 0
                const oRouter = {
                    path: path,
                    component(resolve) {
                        // 判断是否为首路由
                        if (first) {
                            require(['../page/index'], resolve)
                            
                            // 判断是否为多层路由
                        } else if (isChild && !first) {
                            require(['../page/index/layout'], resolve)
                            
                            // 判断是否为最终的页面视图
                        } else {
                            require([`../${component}.vue`], resolve)
                        }
                    },
                    name: name,
                    icon: icon,
                    meta: meta,
                    redirect: (() => {
                        if (!isChild && first && !isURL(path)) return `${path}/index`
                        else return ''
                    })(),
                    // 处理是否为一级路由
                    children: !isChild ? (() => {
                        if (first) {
                            if (!isURL(path)) oMenu[propsDefault.path] = `${path}/index`
                            return [{
                                component(resolve) {
                                    require([`../${component}.vue`], resolve)
                                },
                                icon: icon,
                                name: name,
                                meta: meta,
                                path: 'index'
                            }]
                        }
                        return []
                    })() : (() => {
                        return this.formatRoutes(children, false)
                    })()
                }
                aRouter.push(oRouter)
            }
            if (first) {
                if (!this.routerList.includes(aRouter[0][propsDefault.path])) {
                    aRouter.push({
                        path: '*',
                        redirect: '/404',
                    })
                    this.safe.$router.addRoutes(aRouter)
                    this.routerList.push(aRouter[0][propsDefault.path])
                }
            } else {
                return aRouter
            }
        }
    }
}
export default RouterPlugin
