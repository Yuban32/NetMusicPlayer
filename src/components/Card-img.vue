<template>
    <div class="card-img-wrap">
        <div class="card-img">
            <div class="card-img-bg" :style="`background-image:url(${background})`"></div>
            <div class="card-hot">
                <font-awesome-icon class="card-img-icon" :icon="['fas', 'headphones-alt']" /> 
                {{hot}}
                </div>
        </div>
        <div class="card-name">{{title}}</div>
    </div>
</template>
<script>
export default {
    name:'card-img',
    props:['background','hot','title'],
    
    }

</script>

<style scoped>
    .card-img-wrap{
        height: 190px;
        width: 150px;
        cursor: pointer;
        /* css性能优化 跳过屏幕外的内容渲染 */
        content-visibility: auto; 
    }
    .card-img-wrap .card-img{
        position: relative;
        overflow: hidden;
        border-radius: 5px;
    }
    .card-img-wrap .card-img-bg{
        width: 100%;
        height: 150px;
        background-size: cover;
        background-position: center;
        position: relative;
        transition: 0.5s;
        z-index: -1;
    }
    .card-img-wrap .card-img .card-hot{
        position: absolute;
        z-index: 1;
        bottom: 0;
        width: 100%;
        left: 50%;
        transform: translateX(-50%);
    }
    .card-img-wrap .card-name{
        font-size: 16px;
        margin-top: 15px;
    }
    .card-img:hover .card-img-bg{
        transform: scale(1.2);
        opacity: 1;
    }
</style>