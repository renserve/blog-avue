import {apiDelete,apiPost,apiPut,apiGet} from "@/router/axios";
import store from '@/store'
export class Tag {
    constructor(modelId){
        this.modelId=store.getters.currentMenuModelId || store.getters.userInfo.usermodel[0]
        if(!this.modelId){
            throw new Error('请传入模块model参数')
        }
    }
    get(data) {
        return apiGet('/cms/tag',{modelId:this.modelId,...data})
    }
    put(data) {
        return apiPut('/cms/tag',{modelId:this.modelId,...data})
    }
    post(data) {
        return apiPost('/cms/tag',{modelId:this.modelId,...data})
    }
    delete(id,data) {
        return apiDelete(`/cms/tag/${id}`,data)
    }
}