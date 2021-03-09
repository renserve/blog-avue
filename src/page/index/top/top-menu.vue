<template>
    <div class="top-menu">
        <el-menu
            :default-active="activeIndex"
            mode="horizontal"
            text-color="#333">
            <template v-for="(item,index) in modelOptions">
                <el-menu-item
                    v-if="userInfo.usermodel.includes(item.id)"
                    :index="String(index)"
                    :key="item.id"
                    @click.native="openModuleMenu(index)">
                    <template slot="title">
                        <!--<i :class="item.icon"/>-->
                        <span>{{ item.name }}</span>
                    </template>
                </el-menu-item>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import {resetRouter} from '@/router/router'
    export default {
        name: 'TopMenu',
        inject: ["openMenu"],
        data() {
            return {
                activeIndex: '0',
            }
        },
        created() {

        },
        computed: {
            ...mapGetters(['tagWel','topMenus','modelOptions','userInfo']),
        },
        methods: {
            openModuleMenu(index){
                this.activeIndex=String(index)
                const modelId=this.modelOptions[index].id
                this.$store.commit('SET_CURRENT_MODELID',modelId)
                this.$store.dispatch("GetUsers")
                this.$store.commit('DEL_ALL_TAG')
                this.$router.push({
                    path: this.$router.$avueRouter.getPath({
                        src: this.tagWel.value
                    }),
                    query: this.tagWel.query
                })
                this.$store.dispatch("GetMenu",{modelId}).then(menus => {
                    resetRouter()
                    this.$router.$avueRouter.formatRoutes(menus, true);
                    window.location.reload()
                })
                // this.$router.$avueRouter.formatRoutes(menus, true);
            }
        }
    }
</script>
