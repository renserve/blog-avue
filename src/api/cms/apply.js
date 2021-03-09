import {apiDelete,apiPost,apiPut,apiGet} from "@/router/axios";
import store from '@/store'
export class Apply {
    constructor(modelId){
        this.modelId=store.getters.currentMenuModelId || store.getters.userInfo.usermodel[0]
        if(!this.modelId){
            throw new Error('请传入模块modelId参数')
        }
    }
    passApply(data) {
        return apiPut('/cms/apply/batch/pass',data)
    }
    get(data) {
        return apiGet('/cms/apply',{modelId:this.modelId,...data})
    }
    put(data) {
        return apiPut('/cms/apply',{modelId:this.modelId,...data})
    }
    post(data) {
        return apiPost('/cms/apply',{modelId:this.modelId,...data})
    }
    delete(id,data) {
        return apiDelete(`/cms/apply/${id}`,data)
    }
}

export class Comment {
    constructor(modelId){
        this.modelId=store.getters.currentMenuModelId || store.getters.userInfo.usermodel[0]
        if(!this.modelId){
            throw new Error('请传入模块modelId参数')
        }
    }
    get(data) {
        return apiGet('/cms/comment',{modelId:this.modelId,...data})
    }
    put(data) {
        return apiPut('/cms/comment',{modelId:this.modelId,...data})
    }
    like(id) {
        return apiPut(`/cms/comment/like/${id}`)
    }
    post(data) {
        return apiPost('/cms/comment',{modelId:this.modelId,...data})
    }
    delete(id,data) {
        return apiDelete(`/cms/comment/${id}`,data)
    }
}