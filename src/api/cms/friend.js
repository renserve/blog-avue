import {apiDelete,apiPost,apiPut,apiGet} from "@/router/axios";
import store from '@/store'
export class Friend {
    constructor(modelId){
        this.modelId=store.getters.currentMenuModelId || store.getters.userInfo.usermodel[0]
        if(!this.modelId){
            throw new Error('请传入模块model参数')
        }
    }
    get(data) {
        return apiGet('/cms/friend',{modelId:this.modelId,...data})
    }
    put(data) {
        return apiPut('/cms/friend',{modelId:this.modelId,...data})
    }
    post(data) {
        return apiPost('/cms/friend',{modelId:this.modelId,...data})
    }
    delete(id,data) {
        return apiDelete(`/cms/friend/${id}`,data)
    }
}