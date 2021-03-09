<template>
    <div>
        <mavon-editor
            @change="handleMarkdownChange"
            @save="handleEditorSave"
            @imgAdd="imgAdd"
            @imgDel="imgDel"
            :ishljs="true"
            v-highlight
            v-bind="editor"
            v-model="content"
        ></mavon-editor>
    </div>
</template>

<script>
    import {mavonEditor} from 'mavon-editor'
    import 'mavon-editor/dist/css/index.css'
    import {apiPost} from "@/router/axios";
    export default {
        data() {
            return {
                content:'',
                editor:{}
            }
        },
        components:{
            mavonEditor
        },
        methods: {
            handleMarkdownChange(){

            },
            handleEditorSave(){

            },
            imgAdd(pos, $file){
                const data={image:$file};
                apiPost('/cms/file',data).then(res => {
                    res.data && this.refs.markdownEditor.$img2Url(pos, res.data.url);
                })
            },
            imgDel(){

            }
        }
    }
</script>

<style scoped>

</style>