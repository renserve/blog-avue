const state = {
    imageDomin: '',
    
}
const mutations = {
    SET_IMAGE_DOMIN: (state, data) => {
        state.imageDomin = data
    },
}
const actions = {
    loginOut({commit}) {
        commit('CLEAR_LOCK')
    }
}
export default {
    namespaced: true,
    state,
    mutations,
    actions
}