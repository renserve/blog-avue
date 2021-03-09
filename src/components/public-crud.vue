<template>
    <avue-crud :table-loading="dataComputed('tableLoading')"
               :data="dataComputed('tableData')"
               ref="avueCrud"
               :option="dataComputed('tableOptions')"
               :page="dataComputed('pageInfo')"
               :value="dataComputed('sendFormData')"
               @update:page="updatePage"
               @input="updateSendFormData"
               :upload-before="uploadBefore"
               :before-open="$provide.beforeOpen"
               :before-close="$provide.beforeClose"
               :search.sync="$provide.searchSendData"
               @search-reset="$provide.searchReset"
               @selection-change="$provide.selectionChange"
               @search-change="$provide.searchChange"
               @row-save="$provide.rowSave"
               @row-update="$provide.rowUpdate"
               @row-del="(form,index)=>$provide.rowDelete(form,index)"
               @size-change="$provide.sizeChange"
               @current-change="$provide.currentChange"
               @refresh-change="$provide.getTableList"
               @expand-change="$provide.expandChange"
    >
        <slot slot="expand" name="expand" slot-scope="scope" :row="scope.row"></slot>
        <slot slot="menu" name="menu" slot-scope="scope" :row="scope.row"></slot>
        <slot slot="menuLeft" name="menuLeft" slot-scope="scope" :row="scope.row"></slot>
        <slot slot="menuRight" name="menuRight" slot-scope="scope" :row="scope.row"></slot>
        <template #empty>
            <span>暂无数据</span>
        </template>
        <slot v-for="i in tableSlots" :slot="i.prop"
              :name="i.prop" slot-scope="scope" :row="scope.row">
            <template v-if="i.$type">
                <el-image
                    v-if="scope.row[i.prop] && i.$type.includes('image')"
                    class="columnInsertImage"
                    :src="scope.row[i.prop]"
                    fit="contain"></el-image>
                <state v-else-if="i.$type.includes('status')" :title="scope.row[`$${i.prop}`]"
                       :isLight="i.$type.includes('reverse')?!scope.row[i.prop]:scope.row[i.prop]"
                       @click="$provide.rowUpdate({...scope.row,[i.prop]:scope.row[i.prop]?0:1,isRecord:`${i.prop}:${scope.row[i.prop]?0:1}`})"></state>
            </template>
        </slot>
        <slot v-for="i in formSlots" :slot="`${i.prop}Form`"
              :name="`${i.prop}Form`" slot-scope="scope" :row="scope.row">
            <template v-if="i.$type && i.$type.includes('editor_')">
                <avue-input v-if="i.$type.includes('0')"
                            type="textarea" :minRows="24"
                            :value="getPropValue(i.prop)"
                            @input="e=>setPropValue(e,i.prop)"
                            placeholder="请输入内容"></avue-input>
                <div v-else class="historyWrap">
                    <template v-if="articleContent.length">
                        <el-tag :disable-transitions="true" size="medium" v-for="item in articleContent"
                                @click="safeSaveContentKey(item.key,i.prop,item.value)">{{item.key}}
                        </el-tag>
                        <el-button class="el-icon-delete" @click="clearContentKey()" size="mini"> 清空</el-button>
                    </template>
                    <tinymce
                        v-if="i.$type.includes('1')"
                        @contentSave="contentSave"
                        :value="getPropValue(i.prop)"
                        :key="tinymceKey"
                        @input="e=>setPropValue(e,i.prop)"
                    ></tinymce>
                    <!-- v-model="$provide.sendFormData[i.prop]"-->
                    <mavon-editor
                        v-else
                        :editable="i.disabled?false:true"
                        @save="contentSave"
                        :toolbars="toolbars"
                        ref="markdownEditor"
                        v-highlight
                        codeStyle="monokai-sublime"
                        @imgAdd="imgAdd"
                        :value="getPropValue(i.prop)"
                        @input="e=>setPropValue(e,i.prop)"/>
                </div>
            </template>
        </slot>
    </avue-crud>
</template>

<script>
import State from '@/components/state'
import Tinymce from '../../docs/tinymce/index'
import Upload from '@/components/upload'
import {mapGetters, mapMutations} from 'vuex'
import {apiPost} from "@/router/axios";
import flatten from 'lodash/flatten'

export default {
    name: "pulicCrud",
    props: ['tableLoading', 'tableData', 'tableOptions', 'pageInfo', 'sendFormData'],
    inject: ['$provide'],
    computed: {
        ...mapGetters(['permissionToken', 'articleContent', 'currentMenuModelId']),
    },
    data() {
        return {
            tinymceKey: '0',
            toolbars: {
                bold: true, // 粗体
                italic: true, // 斜体
                header: true, // 标题
                underline: true, // 下划线
                strikethrough: true, // 中划线
                mark: true, // 标记
                superscript: true, // 上角标
                subscript: true, // 下角标
                quote: true, // 引用
                ol: true, // 有序列表
                ul: true, // 无序列表
                link: true, // 链接
                imagelink: true, // 图片链接
                code: true, // code
                table: true, // 表格
                fullscreen: true, // 全屏编辑
                readmodel: true, // 沉浸式阅读
                htmlcode: true, // 展示html源码
                help: true, // 帮助
                /* 1.3.5 */
                undo: true, // 上一步
                redo: true, // 下一步
                trash: true, // 清空
                save: false, // 保存（触发events中的save事件）
                /* 1.4.2 */
                navigation: true, // 导航目录
                /* 2.1.8 */
                alignleft: true, // 左对齐
                aligncenter: true, // 居中
                alignright: true, // 右对齐
                /* 2.2.1 */
                subfield: true, // 单双栏模式
                preview: true, // 预览
            },
            ueditorConfig: {
                action: `${this.baseURL}/cms/file`,
                customConfig: {},
            },
            tableSlots: [],
            formSlots: []
        }
    },
    components: {
        Tinymce,
        Upload,
        State
    },
    methods: {
        dataComputed(key) {
            return this[key] || this.$provide.isDialog && this.$provide.dialogConfig[key] || this.$provide[key]
        },
        getTime(arr) {
            return arr.map(v => String(v).length === 1 ? `0${v}` : String(v)).join(':')
        },
        safeSaveContentKey(time, key, value) {
            this.$alert(...this.$provide.confirmHtmlWrap(`切换到${time}时编辑的内容，切换前请确认当前内容已保存（ctrl+s）`)).then(_ => {
                this.tinymceKey = time
                this.$nextTick(() => {
                    this.$provide.sendFormData[key] = value
                })
            }).catch(_ => {
            })
        },
        clearContentKey() {
            this.$store.commit('SET_CONTENT', false)
            this.$message.success('当前文章内容缓存已清除!')
        },
        contentSave(markdown) {
            let date = new Date()
            const currentData = this.getTime([date.getHours(), date.getMinutes(), date.getSeconds()])
            this.$nextTick(() => {
                const key = this.formSlots.find(i => i.$type && i.$type.includes('editor_')).prop
                this.$store.commit('SET_CONTENT', {
                    key: currentData,
                    value: markdown || this.$provide.sendFormData[key]
                })
                this.$message.success('当前文章内容已存储在LocalStorage中!')
            })
        },
        uploadBefore(file, done, loading, column) {
            done()
        },
        setPropValue(e, key) {
            if (this.$provide.isDialog) {
                if (!this.$provide.dialogConfig.sendFormData) {
                    this.$provide.sendFormData[key] = e
                } else {
                    this.$provide.dialogConfig.sendFormData[key] = e
                }
            } else {
                this.$provide.sendFormData[key] = e
            }
        },
        getPropValue(key) {
            if (this.$provide.isDialog) {
                if (!this.$provide.dialogConfig.sendFormData) {
                    return this.$provide.sendFormData[key] || ''
                } else {
                    return this.$provide.dialogConfig.sendFormData[key] || ''
                }
            } else {
                return this.$provide.sendFormData[key] || ''
            }
        },
        imgAdd(pos, file) {
            const data = {image: file};
            let that = this
            console.log(pos, '=====')
            apiPost(`${this.baseURL}/cms/file`, data).then(res => {
                res.data && this.$refs.markdownEditor[0].$img2Url(pos, res.data.url);
            })
        },
        updateSendFormData(sendFormData) {
            if (this.$provide.isDialog) {
                this.$provide.dialogConfig.sendFormData = sendFormData
            } else {
                this.$provide.sendFormData = sendFormData
            }
        },
        updatePage(pageInfo) {
            const pageOriginInfo = this.$provide.isDialog ? this.$provide.dialogConfig.pageInfo : this.$provide.pageInfo;
            const avueCrudRef = this.$refs.avueCrud
            //todo total为0时数据视图不刷新问题
            if (avueCrudRef && avueCrudRef.$refs) {
                if (!pageOriginInfo.total) {
                    avueCrudRef.$refs.tablePage.$el.style.display = 'none'
                    return false
                } else {
                    avueCrudRef.$refs.tablePage.$el.style.display = 'block'
                }
            }
            Object.assign(pageOriginInfo, pageInfo)
        }
    },
    created() {
        const tableForm = this.dataComputed('tableForm')
        const formGroup = this.$provide.isDialog ? this.$provide.dialogConfig['formGroup'] : this.$provide['formGroup']
        this.tableSlots = tableForm.filter(i => i.slot)
        this.formSlots = formGroup ? flatten(formGroup.map(data => {
            data.column = data.column.filter(i => i.formslot)
            return data.column
        })) : tableForm.filter(i => i.formslot)
        console.log(this.formSlots, '==')
    },
    mounted() {

    }
}
</script>

<style scoped lang="scss">
.historyWrap {
    .el-tag, .el-button {
        cursor: pointer;
        margin-right: 5px;
        margin-bottom: 8px;
    }
}

> > > .content-input-wrapper {
    height: 100%;

    .content-input {
        height: 100%;
        min-height: 300px !important;
    }
}

> > > .avue-ueditor__dialog {
    z-index: 9;
}

> > > .w-e-text-container {
    height: unset !important;

    .w-e-text {
        min-height: 300px;
    }
}
</style>