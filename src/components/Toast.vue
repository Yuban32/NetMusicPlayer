<template>
    <div class="toast-wrap" :class="show?'show':''">
        {{msg}}
    </div>
</template>

<script>
export default {
    data(){
        return{
            show:false,
            msg:'',
            timer:null
        }
    },methods:{
        showToast(msg,duration){
            duration = duration*1000;
            this.msg = msg;
            this.show=true;
            if(this.timer){
                clearTimeout(this.timer);
            }
            this.timer = setTimeout(()=>{
                this.show=false
                this.msg = ''
            
            },duration);
        }
    },
    created(){
        
    }
}
</script>

<style scoped>
    .toast-wrap{
        visibility: hidden;
        position: fixed;
        z-index: 999;
        left: 50%;
        top: 10%;
        transform: translate(-50%,-20%);
        text-align: center;
        font-size: 18px;
        padding: 20px;
        border-radius: 15px;
        border: 1px solid rgb(255, 255, 255);
        background-color: rgba(255, 255, 255, 0.418);
    }
    .show{
        visibility: visible;
        animation: fadein 0.5s,fadeout 0.5s 2.5s;
    }
    @keyframes fadein{
        from{
            top: 0;
            opacity: 0;
        }to{
            top: 10%;
            opacity: 1;
        }
    }
    @keyframes fadeout{
        from{
            top: 10%;
            opacity: 1;
        }to{
            top: 0;
            opacity: 0;
        }
    }
</style>