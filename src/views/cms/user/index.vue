<template>
    <div class="user">
        <basic-container>
            <row-col>
                <template #left>
                    <model-tab :currentModel="currentModel" @tab-click="tabChange"></model-tab>
                </template>
                <template #right>
                    <public-crud></public-crud>
                </template>
            </row-col>
        </basic-container>
    </div>

</template>

<script>
    import {User, Model, Group} from '@/api/cms/super'
    import RowCol from '@/components/row-col'
    import tableMixin from '@/mixins/table'

    export default {
        mixins: [tableMixin],
        name: 'SysUser',
        components: {
            RowCol
        },
        data() {
            return {
                imgMultipleList: {
                    'avatar': []
                },
                hideUploadList: {
                    avatar: false
                },
                groupOptions: [],
                currentModel: undefined,
                tableConfig: {
                    menuWidth: 150,
                    isDelayRequest: true
                },
            }
        },
        computed: {
            tableForm() {
                return [
                    {
                        label: '用户名',
                        prop: 'username',
                    },
                    {
                        label: '类型',
                        prop: 'usermodel',
                        type: 'checkbox',
                        props: {
                            label: "name",
                            value: "id"
                        },
                        dicData: this.modelOptions
                    },
                    {
                        label: '是否锁定',
                        prop: 'isLock',
                        hide: true,
                        button: true,
                        type: 'radio',
                        dicData: [
                            {label: "不锁定", value: 0},
                            {label: "锁定", value: 1},
                            /*{label: "锁定 v1", value: 1},
                            {label: "锁定 v2", value: 2},
                            {label: "锁定 v3", value: 3},
                            {label: "锁定 v4", value: 4},
                            {label: "锁定 v5", value: 5}*/
                        ]
                    },
                    {
                        label: '密码',
                        prop: 'password',
                        hide: true,
                    },
                    {
                        label: '昵称',
                        prop: 'nickname',
                    },
                    {
                        label: '头像',
                        prop: 'avatar',
                        type: 'upload',
                        ...this.uploadConfig
                    },
                    {
                        label: '个性签名',
                        hide:true,
                        prop: 'signature',
                        type: 'textarea',
                        minRows: 2
                    },
                    {
                        label: '邮箱',
                        prop: 'email',
                    },
                    {
                        label: '分组',
                        prop: 'groupIds',
                        type: 'checkbox',
                        props: {
                            label: "info",
                            value: "id"
                        },
                        dicData: this.groupOptions
                    }
                ]
            }
        },
        async created() {
            this.groupOptions = await new Group().get()
        },
        methods: {
            tabChange(tab) {
                if (tab.name !== this.currentModel) {
                    this.currentModel = tab.name
                    this.sendData.page = 0
                    this.getTableList()
                    this.initFormData = {
                        isLock: 1,
                        usermodel: [tab.name]
                    }
                }
            },
            rowUpdateCallBack(data) {
                const {usermodel, nickname, avatar, username} = data
                if (username === this.userInfo.username) {
                    this.$store.commit('SET_USER_INFO', {usermodel: usermodel.split(','), nickname, avatar, username})
                }
            },
            rowUpdateApi(data) {
                return new User(this.currentModel).put(data)
            },
            rowSaveApi(data) {
                return new User(this.currentModel).post(data)
            },
            rowDeleteApi(id, data) {
                return new User(this.currentModel).delete(id, data)
            },
            tableGetApi(...args) {
                return new User(this.currentModel).get(...args)
            },
        }
    }
</script>
<style lang="scss">

</style>

