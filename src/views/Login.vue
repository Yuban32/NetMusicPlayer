<template>
  <div class="user">
    <toast ref="toast"></toast>
    <div class="loginWrap">
      <form class="form">
        <p><input type="text" placeholder="手机号" v-model="phone" /></p>
        <p><input type="password" placeholder="请输入密码" v-model="password" @keyup.enter.prevent="login"/></p>
        <button @click.prevent="login">登录</button>
      </form>
    </div>
  </div>
</template>
<script>
import Toast from '@/components/Toast'
export default {
  name: "User",
  data(){
    return{
      phone:'',
      password:'',
    }
  },methods:{
      login(){
        let timer = null;
        let reg =/^1[3|4|5|7|8]\d{9}$/;
        let re = new RegExp(reg)
        let md5_password = this.$md5(this.password);
        if(re.test(this.phone)){
          this.axios.post(`/login/cellphone?phone=${this.phone}&md5_password=${md5_password}`).then(result=>{
            // console.log(result);
            let code = result.data.code;
            let msg = result.data.msg;
            if(code==200){
              let userInfo = result.data.profile;
              this.$refs.toast.showToast('登录成功,3秒后自动跳转到个人页面',3);
              this.$store.commit('setLoginCookie',result.data.cookie);
              this.$store.commit('setLoginStatus',true);
              timer = setTimeout(()=>{
                // console.log(this);
                this.$store.commit('getUserInfo',userInfo);
                this.$store.commit('setUserID',userInfo.userId)
                this.$router.push({path:'/user'});
              },3000);
              
            }else if(code==502){
              this.$refs.toast.showToast(msg,3);
            }
          }).catch(error=>{
            console.log(error);
          })
        }else{
          this.$refs.toast.showToast('手机号输入错误', 3);
        }
      }
  },components:{
    'toast':Toast
  },mounted() {
    this.$refs.toast.showToast('您还未登录,请先登录!',3);
}
};
</script>
<style scope>
.form button{
  cursor: pointer;
}
.user {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
}

.loginWrap {
  padding: 50px;
  border-radius: 20px;
  background-color: rgba(18, 23, 28, 0.678);
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}
.form input {
  background-color: transparent;
  border: none;
  border-bottom: 1px solid #d0c5c2;
  text-align: center;
  font-size: 22px;
  margin-top: 20px;
  color: #fff;
  padding: 0 10px 0 10px;
  transition: 0.5s all;
}
.form input:focus {
  color: #fff;
  border-color: #fff;
}
.form button {
  background-color: transparent;
  outline: none;
  width: 288px;
  margin-top: 20px;
  border: 1px solid #d0c5d2;
  font-size: 22px;
  transition: 0.2s all;
  position: relative;
}
.form button:active {
  color: #fff;
  border-color: #fff;
  bottom: -1px;
}

</style>