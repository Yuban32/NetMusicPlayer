<template>
    <div class="card-img-wrap" ref="card_img_wrap" @mouseenter="hoverCardName" @mouseleave="classShow=false">
        <div class="card-img">
            <div class="card-img-bg" :style="`background-image:url(${background})`"></div>
            <div class="card-hot">
                <font-awesome-icon class="card-img-icon" :icon="['fas', 'headphones-alt']" /> 
                {{hot}}
                </div>
        </div>
        <div class="card-name" ref="card_name" :style="{width:widths+'px'}" :class="classShow?'scroll':''">{{title}}</div>
    </div>
</template>
<script>
export default {
    name:'card-img',
    data(){
        return{
            widths:0,
            timer:null,
            translateX:null,
            classShow:''
        }
    },
    props:['background','hot','title'],
    methods:{
        fontWidth(){
            let str = this.$refs.card_name.textContent
            let con = document.createElement('canvas').getContext('2d');
            con.font = '16px Avenir Helvetica Arial, sans-serif';
            this.widths = con.measureText(str).width
        },
        hoverCardName(){
            let offsetWidth = this.$refs.card_img_wrap.offsetWidth
            if(this.widths>offsetWidth){
                this.classShow=true
            }else if(this.widths<=offsetWidth){
                this.classShow=false

            }
        }
    },mounted(){
        this.fontWidth()
        // this.hoverCardName()
        // console.log(this.widths);
    }
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
        overflow-y: auto;
        word-wrap: break-word;
        margin: 15px auto 0;
        transition: all 1s;
    }
    .scroll{
        animation: 3s loop linear infinite;
    }
    @keyframes loop{
        0%{
            transform: translateX(0px);
        }25% {
        transform: translateX(0%);
        }
        50% {
            transform: translateX(calc(-50%));
        }
        75% {
            transform: translateX(calc(-50%));
        }100%{
            transform: translateX(0px);
        }
    }
    .card-img:hover .card-img-bg{
        transform: scale(1.2);
        opacity: 1;
    }
</style>