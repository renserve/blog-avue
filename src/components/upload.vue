<template>
    <div>
        <el-upload
            :class="{hideImgListCon:hideUploadList[prop]}"
            :file-list="imgMultipleList[prop]"
            :data="{model:userInfo.usermodel.join(',')}"
            :with-credentials="true"
            :on-remove="(file, fileList)=>imageBeforeRemove(file, fileList,prop)"
            :on-success="(response,file, fileList)=>imageUploadSuccess(response,file, fileList,prop)"
            :on-error="imageUploadError"
            :limit="1"
            :disabled="disabled"
            list-type="picture-card"
            :action="`${baseURL}/cms/file`"
            :headers="{Authorization:permissionToken.access_token}"
            :accept="uploadType[type]"
            :on-preview="imageDialogPreview"
        >
            <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogPreviewVisible">
            <img width="100%" :src="dialogPreviewImageUrl" alt="">
        </el-dialog>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    export default {
        computed: {
            ...mapGetters(['permissionToken']),
        },
        inject:['imgMultipleList','hideUploadList'],
        props:{
            prop:undefined,
            disabled:false,
            type:'img',
        },
        name: "upload",
        data() {
            return {
                /*{
                   label: '头像',
                   prop: 'avatar',
                   slot:true,
                   $type:'image',
                   formslot:true
               },*/
                uploadType:{
                    img:'.jpg,.jpeg,.bmp,.png,.gif',
                },
                dialogPreviewImageUrl:'',
                dialogPreviewVisible:false,
            }
        },
        created(){

        },
        methods: {
            changeImgList(url,key,sign){
                const index=this.imgMultipleList[key].findIndex(item=>item.sign===sign)
                console.log(index)
                if(index>-1){
                    this.imgMultipleList[key].splice(index,1);
                }else {
                    this.imgMultipleList[key].push({url:url,sign:sign});
                }
                this.hideUploadList[key] = this.imgMultipleList[key].length >= 1;
            },
            imageUploadError(response, file, fileList){
                this.$message.error('上传错误,请联系管理员')
            },
            imageBeforeRemove(file, fileList,key) {
                if(!this.imgMultipleList[key].length) return;
                this.changeImgList(file.url,key,file.sign)
            },
            imageUploadSuccess(response,file,fileList,key){
                response && this.changeImgList(response.url,key,file.uid)
            },
            imageDialogPreview(file){
                this.dialogPreviewImageUrl = file.url;
                this.dialogPreviewVisible = true;
            }
        }
    }
</script>

<style scoped lang="scss">
    //上传框展示
    .hideImgListCon {
        >>> .el-upload--picture-card{
            display: none!important;
        }
    }
</style>