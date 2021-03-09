<template>
    <div>
        <span @click="isClick?$emit('click'):''" :class="[isLight?'row_tag_blue':'row_tag_red',{'row_tag_btn':isClick}]">{{title}}</span>
    </div>
</template>

<script>
    export default {
        props:{
            isClick:{
                default:true
            },
            title:undefined,
            isLight:undefined
        },
        name: "state"
    }
</script>

<style scoped>

</style>