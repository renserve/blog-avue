import {apiDelete,apiPost,apiPut,apiGet} from "@/router/axios";
import store from '@/store'
export class User {
    constructor(modelId){
        this.modelId=store.getters.currentMenuModelId || store.getters.userInfo.usermodel[0]
        if(!this.modelId){
            throw new Error('请传入模块model参数')
        }
    }
    get(data) {
        return apiGet('/cms/admin/users',{modelId:this.modelId,...data})
    }
    delete(id,data) {
        return apiDelete(`/cms/admin/user/${id}`,data)
    }
    put(data) {
        return apiPut('/cms/admin/user',{usermodel:this.modelId,...data})
    }
    post(data) {
        return apiPost('/cms/user/register',{usermodel:this.modelId,...data})
    }
}
export class Group {
    constructor(modelId){
        this.modelId=store.getters.currentMenuModelId || store.getters.userInfo.usermodel[0]
        if(!this.modelId){
            throw new Error('请传入模块model参数')
        }
    }
    dispatch(data){
        return apiPost('/cms/admin/permission/dispatch',data)
    }
    get(data) {
        return apiGet('/cms/admin/group',{modelId:this.modelId,...data})
    }
    delete(id,data) {
        return apiDelete(`/cms/admin/group/${id}`,data)
    }
    put(data) {
        return apiPut('/cms/admin/group',{modelId:this.modelId,...data})
    }
    post(data) {
        return apiPost('/cms/admin/group',{modelId:this.modelId,...data})
    }
}
export class Model {
    static get(data) {
        return apiGet('/cms/user/model',data)
    }
    static delete(id,data) {
        return apiDelete(`/cms/user/model/${id}`,data)
    }
    static post(data) {
        return apiPost('/cms/user/model',data)
    }
    static put(data) {
        return apiPut('/cms/user/model',data)
    }
}
export class Log {
    constructor(modelId){
        this.modelId=store.getters.currentMenuModelId || store.getters.userInfo.usermodel[0]
        if(!this.modelId){
            throw new Error('请传入模块model参数')
        }
    }
    getLog(data) {
        return apiGet('/cms/log',{modelId:this.modelId,...data})
    }
    delLog(data) {
        return apiDelete('/cms/log/batch/delete',data)
    }
}