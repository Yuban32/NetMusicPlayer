<template>
    <div class="qr-login-wrap">
        <toast ref="toast" />
        <img class="qrcode" :src="qrImg" alt="登录二维码">
        <h1 class="login-title">请使用网易云APP扫码登录</h1>
    </div>
</template>
<script>

import Toast from '@/components/Toast'
export default {
    name: "QRLogin",
    data() {
        return {
            qrImg: '',
        }
    }, methods: {
        async checkStatus(key){
            const res = await this.axios.get(`/login/qr/check?key=${key}&timerstamp=${Date.now()}`)
            return res.data;
        },
        async getLoginStatus(cookie = ''){
            const res = await this.axios({
                url:`/login/status?timerstamp=${Date.now()}`,
                method:'post',
                data:{
                    cookie
                }
            })
            return res.data;
        },
        async login(){
            let timer;
            const cookie = localStorage.getItem('cookie');
            console.log(cookie);
            this.checkStatus(cookie);
            const res = await this.axios({
                url:`/login/qr/key?timerstamp=${Date.now()}`
            });
            const key = res.data.data.unikey;
            const res2 = await this.axios({
                url:`/login/qr/create?key=${key}&qrimg=true&timerstamp=${Date.now()}`
            });
            this.qrImg = res2.data.data.qrimg;

            timer = setInterval(async ()=>{
                if(cookie!=null){
                    return
                }
                const statusRes = await this.checkStatus(key);
                console.log(statusRes);
                if(statusRes.code === 800){
                    this.$refs.toast.showToast('二维码过期',3);
                    clearInterval(timer)
                }
                if(statusRes.code === 803){
                    this.$refs.toast.showToast("登录成功,3秒后跳转到个人界面",3);
                    let userInfo =  await this.getLoginStatus(statusRes.cookie);
                    this.$store.commit('setLoginCookie',statusRes.cookie);
                    this.$store.commit('setLoginStatus',true);
                    console.log(userInfo.data.profile);
                    setTimeout(()=>{
                        this.$store.commit('getUserInfo',userInfo.data.profile);
                        this.$store.commit('setUserID',userInfo.data.profile.userId);
                        this.$router.push({path:'/user'});
                    },3000);
                    

                }
            },3000)
        }

    }, mounted() {
        // this.generatorQRCode()
        this.login();
        
    },components:{
        'toast':Toast
    }
}

</script>

<style>
    .qr-login-wrap{
        height: 100vh;
        display:flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .login-title{
        margin-top: 50px;
    }
    .qrcode{
        width: 15%;
    }
</style>