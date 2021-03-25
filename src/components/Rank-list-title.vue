<template>
    <div class="rank-list-title">
        {{title}}
    </div>
</template>
<script>
export default {
    props:['title']
}
</script>
<style scoped>
    .rank-list-title{
        letter-spacing: 10px;
        font-size: 2.5em;
        font-weight:700;
    }
</style>