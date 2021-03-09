import {apiDelete,apiPost,apiPut,apiGet} from "@/router/axios";
import store from '@/store'
export class Article {
    constructor(modelId){
        this.modelId=store.getters.currentMenuModelId || store.getters.userInfo.usermodel[0]
        if(!this.modelId){
            throw new Error('请传入模块model参数')
        }
    }
    get(data) {
        return apiGet('/web/article/article/all',{modelId:this.modelId,...data})
    }
    like(id) {
        return apiPut(`/web/article/article/subjoin`,{id,like:1})
    }
    delete(id,data) {
        return apiDelete(`/web/article/article/${id}`,data)
    }
    post(data) {
        return apiPost('/web/article/article',{modelId:this.modelId,...data})
    }
    put(data) {
        return apiPut('/web/article/article',{modelId:this.modelId,...data})
    }
}