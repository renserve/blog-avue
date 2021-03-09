<template>
    <avue-form ref="avueForm" v-model="$provide.sendFormData" :upload-before="uploadBefore"
               :option="$provide.formOptions" @submit="(form,done)=>$provide.formSave(form,done)">
        <slot v-for="i in formSlots" :slot="`${i.prop}`" :name="`${i.prop}`" slot-scope="scope" :row="scope.row">
            <template v-if="i.$type==='editor'">
                <tinymce v-model="$provide.sendFormData.content"></tinymce>
            </template>
        </slot>
        <slot slot-scope="scope" slot="menuForm" name="menuForm" :row="scope.row">
            <el-button type="info">取消</el-button>
        </slot>
    </avue-form>
</template>

<script>
    import Tinymce from '../../docs/tinymce/index'
    import {mapGetters} from 'vuex'
    import Upload from '@/components/upload'
    export default {
        name: "publicForm",
        inject: ['$provide'],
        components:{
            Upload,
            Tinymce
        },
        created(){
            this.formSlots=this.$provide.formColumn.filter(i=>i.formslot)
        },
        data() {
            return {
                formSlots:[]
            }
        },
        uploadBefore(file, done, loading,column){
            column.data.model=this.$provide.currentModel || this.userInfo.usermodel.join(',')
            done()
        },
        computed:{

        },
        methods: {}
    }
</script>

<style scoped>

</style>