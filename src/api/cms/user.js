import {apiDelete,apiPost,apiPut,apiGet} from "@/router/axios";
export class User {
    static login(data) {
        return apiPost('/cms/user/login',data)
    }
    static info(data) {
        return apiGet('/cms/user/information',data)
    }
    static password(data) {
        return apiPut('/cms/user/password',data)
    }
    static self(data) {
        return apiPut('/cms/user',data)
    }
    static permission(data) {
        return apiGet('/cms/user/permissions',data)
    }
}