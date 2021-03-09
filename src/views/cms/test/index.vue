<template>
    <basic-container>
        <!--<mavon-editor
          ref="markdownEditor"
          v-highlight
          codeStyle="monokai-sublime"
          @imgAdd="imgAdd"
          @change="change"
          v-model="value"/>-->
        <tinymce v-model="content"></tinymce>

    </basic-container>
</template>

<script>
    import Tinymce from '../../../../docs/tinymce/index'
    export default {
        name: 'BlogWrite',
        data() {
            return {
                content:''
            }
        },
        methods: {
            imgAdd(pos,file){
                const data={image:file};
            },
            change(e){
                console.log(e)
            }
        },
        components: {
            Tinymce
        }
    }
</script>

<style>

</style>