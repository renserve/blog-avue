import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import VuexPersistence from 'vuex-persist'

const modulesFiles = require.context('./modules', true, /\.js$/)
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
    const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
    const value = modulesFiles(modulePath)
    modules[moduleName] = value.default
    return modules
}, {})
const modulesLocal = modulesFiles.keys().map(i => i.replace(/^\.\/(.*)\.\w+$/, '$1')).filter(i =>!['exclude','common','logs','tags'].includes(i))

const vuexLocal = new VuexPersistence({
    key: 'cms',
    storage: window.localStorage,
    modules: modulesLocal
})
Vue.use(Vuex)
const store = new Vuex.Store({
    modules:modules,
    getters,
    plugins: [vuexLocal.plugin]
})

export default store
