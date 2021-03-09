const state = {
    reqloading: false,
    isMenuRefresh: true,
}
const mutations = {
    SET_REQUEST_LOADING: (state, data) => {
        state.reqloading = data
    },
    CHANGE_MENU_REFRESH_STATE: (state, data) => {
        state.isMenuRefresh = data
    }
}
const actions = {}
export default {
    namespaced: true,
    state,
    mutations,
    actions
}