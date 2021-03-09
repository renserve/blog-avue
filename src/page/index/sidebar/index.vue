<template>
    <div class="avue-sidebar">
        <logo/>
        <el-scrollbar style="height:100%">
            <div
                v-if="validatenull(menus)"
                class="avue-sidebar--tip">没有发现菜单
            </div>
            <el-menu
                :default-active="nowTagValue"
                :show-timeout="200"
                :collapse="keyCollapse"
                unique-opened
                mode="vertical">
                <sidebar-item
                    :menu="menus"
                    :screen="screen"
                    :props="website.menu.props"
                    :collapse="keyCollapse"
                    first/>
            </el-menu>
        </el-scrollbar>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import logo from '../logo'
    import sidebarItem from './sidebarItem'

    export default {
        name: 'Sidebar',
        inject: ["currentMenus"],
        components: {sidebarItem, logo},
        created() {

        },
        computed: {
            ...mapGetters(['website', 'menus', 'tag', 'keyCollapse', 'screen']),
            nowTagValue: function () {
                return this.$router.$avueRouter.getValue(this.$route)
            }
        }
    }
</script>


