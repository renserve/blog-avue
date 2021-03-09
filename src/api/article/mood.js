import {apiDelete,apiPost,apiPut,apiGet} from "@/router/axios";
import store from "@/store";
export class Mood {
    constructor(modelId){
        this.modelId=store.getters.currentMenuModelId || store.getters.userInfo.usermodel[0]
        if(!this.modelId){
            throw new Error('请传入模块model参数')
        }
    }
    get(data) {
        return apiGet('/web/article/mood/all',{modelId:this.modelId,...data})
    }
    put(data) {
        return apiPut(`/web/article/mood`,{...data,isBackground:true})
    }
    post(data) {
        return apiPost('/web/article/mood',{...data,isBackground:true} )
    }
    deleteMore(data) {
        return apiDelete(`/web/article/mood/batch`,data)
    }
    delete(id,data) {
        return apiDelete(`/web/article/mood/${id}`,data)
    }
}