<template>
    <div class="rank-list-title" :style="{fontSize:fontSize+'px',textAlign:textAlign}">
        {{title}}
    </div>
</template>
<script>
export default {
    props:['title','fontSize','textAlign']
}
</script>
<style scoped>
    .rank-list-title{
        letter-spacing: 10px;
        font-size: 2.5em;
        font-weight:700;
    }
</style>