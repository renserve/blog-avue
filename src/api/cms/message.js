import {apiDelete,apiPost,apiPut,apiGet} from "@/router/axios";
import store from '@/store'
export class Message {
    constructor(modelId){
        this.modelId=store.getters.currentMenuModelId || store.getters.userInfo.usermodel[0]
        if(!this.modelId){
            throw new Error('请传入模块model参数')
        }
    }
    get(data) {
        return apiGet('/cms/message',{modelId:this.modelId,...data})
    }
    put(data) {
        return apiPut('/cms/message',{modelId:this.modelId,...data})
    }
    post(data) {
        return apiPost('/cms/message',{modelId:this.modelId,...data})
    }
    delete(id,data) {
        return apiDelete(`/cms/message/${id}`,data)
    }
}

export class Comment {
    constructor(modelId){
        this.modelId=store.getters.currentMenuModelId || store.getters.userInfo.usermodel[0]
        if(!this.modelId){
            throw new Error('请传入模块model参数')
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