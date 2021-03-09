import {getStore, setStore} from '@/util/store'
import {setCookie, getCookie} from '@/util/cookie'
import {isURL, validatenull} from '@/util/validate'
import {deepClone, encryption, recursionMenu} from '@/util/util'
import superRouter from '@/router/stage/super'
import {resetRouter} from '@/router/router'
import {Menu} from '@/api/cms/menu'
import {User} from '@/api/cms/user'
import {User as SuperUser} from '@/api/cms/super'
import {Model} from '@/api/cms/super'
import isArray from 'lodash/isArray'
import isBoolean from 'lodash/isBoolean'

const user = {
    state: {
        userInfo: {},
        permissions: [],
        permissionToken: {
            refresh_token: '',
            access_token: ''
        },
        usersList:[],
        articleContent: [],
        topMenus: undefined,
        currentMenuModel: undefined,
        currentMenuModelId: undefined,
        menus: undefined,
        modelOptions: [],
        permissionButton: []
    },
    actions: {
        // 注销session
        FedLogOut({commit}) {
            return new Promise(resolve => {
                resetRouter();
                commit('SET_MENUS', undefined)
                commit('SET_TOP_MENUS', undefined)
                commit('SET_PERMISSIONS', [])
                commit('SET_USER_INFO', {})
                commit('SET_TOKEN', '')
                commit('SET_MODELS', [])
                commit('DEL_ALL_TAG')
                commit('CLEAR_LOCK')
                resolve()
            })
        },
        // 根据用户名登录
        LoginByUsername({commit}, userInfo) {
            return new Promise((resolve, reject) => {
                User.login(userInfo).then(data => {
                    commit('SET_TOKEN', data)
                    commit('CLEAR_LOCK')
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        GetModels({commit}, userInfo) {
            return new Promise(async (resolve, reject) => {
                Model.get().then(data => {
                    commit('SET_MODELS', {data, usermodel: userInfo.usermodel, isLock: userInfo.isLock})
                }).catch(() => {
                    reject()
                })
            })
        },
        GetUserInfo({commit}) {
            return new Promise((resolve, reject) => {
                User.info().then(data => {
                    const {usermodel, nickname, avatar, permissions, username, groupIds, isLock, id} = data
                    commit('SET_USER_INFO', {usermodel, nickname, avatar, username, groupIds, isLock, id})
                    commit('SET_PERMISSIONS', permissions)
                    resolve({groupIds: groupIds.join(','), isLock, usermodel})
                }).catch(() => {
                    reject()
                })
            })
        },
        async GetUsers({commit, state}) {
            const users=await new SuperUser(state.currentMenuModelId).get()
            commit('SET_USERS_LIST',users)
        },
        // 获取系统菜单

        GetMenu({commit, state}, params) {
            return new Promise(resolve => {
                //执行存储menu
                new Menu(params.modelId).getPermission(params).then(data => {
                    commit('SET_CURRENT_MODELID',params.modelId)
                    const parent = [], children = [], permissionButton = [];
                    data.map(item => {
                        item.children = []
                        item.meta = {}
                        if (item.type === 'button') {
                            item.permissionCode && permissionButton.push(item.permissionCode)
                        } else {
                            item.meta.permissionCode=item.permissionCode
                            if (!item.parentId) {
                                parent.push(item)
                            } else {
                                children.push(item)
                            }
                        }
                    })
                    const menus = recursionMenu(parent, children)
                    console.log(menus,'menus')
                    commit('SET_MENUS', menus)
                    commit('exclude/CHANGE_MENU_REFRESH_STATE', false)
                    commit('SET_TOP_MENUS', menus.filter(i => i.type === 'top'))
                    commit('SET_PERMISSION_CODE', permissionButton)
                    resolve(menus)
                })
            })
        },
    },
    mutations: {
        SET_USERS_LIST:(state, users) => {
            state.usersList=users
        },
        SET_CURRENT_MODELID:(state, modelId) => {
            state.currentMenuModelId=modelId
        },
        SET_CONTENT: (state, data) => {
            if (isBoolean(data)) {
                state.articleContent = []
                return
            }
            state.articleContent.unshift(data)
            state.articleContent.length >= 30 && state.articleContent.pop()
        },
        SET_MODELS: (state, data) => {
            let modelInfo;
            if (isArray(data)) {
                modelInfo = data
            } else {
                if (data.isLock) {
                    modelInfo = data.data.filter(i => data.usermodel.includes(i.id))
                } else {
                    modelInfo = data.data
                }
            }
            console.log(data,'modelInfo')
            state.modelOptions = modelInfo
        },
        SET_USER_INFO: (state, data) => {
            Object.keys(data).map(k => {
                state.userInfo[k] = data[k]
            })
        },
        SET_TOKEN: (state, data) => {
            if (data) {
                data.refresh_token && (state.permissionToken.refresh_token = `Bearer ${data.refresh_token}`)
                data.access_token && (state.permissionToken.access_token = `Bearer ${data.access_token}`)
            } else {
                state.permissionToken.refresh_token = ''
                state.permissionToken.access_token = ''
            }
        },
        SET_PERMISSIONS: (state, data) => {
            state.permissions = data
        },
        SET_TOP_MENUS: (state, data) => {
            state.topMenus = data
        },
        SET_MENUS: (state, data) => {
            state.menus = data
        },
        SET_PERMISSION_CODE: (state, data) => {
            state.permissionButton = data
        },
    }
    
}
export default user
