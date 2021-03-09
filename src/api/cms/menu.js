import {apiDelete,apiPost,apiPut,apiGet} from "@/router/axios";
import store from '@/store'
export class Menu {
    constructor(modelId){
        this.modelId=store.getters.currentMenuModelId || store.getters.userInfo.usermodel[0]
        if(!this.modelId){
            throw new Error('请传入模块model参数')
        }
    }
    getPermission(data) {
        return apiGet('/cms/menu/permission',{modelId:this.modelId,...data})
    }
    get(data) {
        return apiGet('/cms/menu',{modelId:this.modelId,...data})
    }
    post(data) {
        return apiPost('/cms/menu',{modelId:this.modelId,...data})
    }
    put(data) {
        return apiPut('/cms/menu',{modelId:this.modelId,...data})
    }
    delete(id,data) {
        return apiDelete(`/cms/menu/${id}`,data)
    }
}
