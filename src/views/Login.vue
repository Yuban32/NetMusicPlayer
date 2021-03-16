<template>
  <div class="about">
    <div class="loginWrap">
      <div class="from">
        <p><input type="text" placeholder="请输入帐号/邮箱/手机号" /></p>
        <p><input type="password" placeholder="请输入密码" /></p>
        <button>登录</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Login",
};
</script>
<style scope>
.about {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;

  /* flex-direction: column; */
}

.loginWrap {
  padding: 50px;
  border-radius: 20px;
  background-color: #12171cad;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}
.from input {
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
.from input:focus {
  color: #fff;
  border-color: #fff;
}
.from button {
  background-color: transparent;
  outline: none;
  width: 288px;
  margin-top: 20px;
  border: 1px solid #d0c5d2;
  font-size: 22px;
  transition: 0.2s all;
  position: relative;
}
.from button:active {
  color: #fff;
  border-color: #fff;
  bottom: -1px;
}
</style>