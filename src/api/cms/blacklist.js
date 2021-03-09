import {apiDelete,apiPost,apiPut,apiGet} from "@/router/axios";
import store from '@/store'
export class Blacklist {
    constructor(modelId){
        this.modelId=store.getters.currentMenuModelId || store.getters.userInfo.usermodel[0]
        if(!this.modelId){
            throw new Error('请传入模块model参数')
        }
    }
    get(data) {
        return apiGet('/cms/blacklist',{modelId:this.modelId,...data})
    }
    put(data) {
        return apiPut('/cms/blacklist',{modelId:this.modelId,...data})
    }
    postAndDeleteMessage(data) {
        return apiPost('/cms/blacklist/message',{modelId:this.modelId,...data})
    }
    postAndDeleteApply(data) {
        return apiPost('/cms/blacklist/apply',{modelId:this.modelId,...data})
    }
    postAndDeleteComment(data) {
        return apiPost('/cms/blacklist/comment',{modelId:this.modelId,...data})
    }
    post(data) {
        return apiPost('/cms/blacklist',{modelId:this.modelId,...data})
    }
    delete(id,data) {
        return apiDelete(`/cms/blacklist/${id}`,data)
    }
}