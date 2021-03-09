import {apiDelete,apiPost,apiPut,apiGet} from "@/router/axios";
import store from '@/store'
export class Idea {
    constructor(modelId){
        this.modelId=store.getters.currentMenuModelId || store.getters.userInfo.usermodel[0]
        if(!this.modelId){
            throw new Error('请传入模块modelId参数')
        }
    }
    get(data) {
        return apiGet('/cms/idea',{modelId:this.modelId,...data})
    }
    put(data) {
        return apiPut('/cms/idea',{modelId:this.modelId,...data})
    }
    post(data) {
        return apiPost('/cms/idea',{modelId:this.modelId,...data})
    }
    delete(id,data) {
        return apiDelete(`/cms/idea/${id}`,data)
    }
}