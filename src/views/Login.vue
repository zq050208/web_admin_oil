<template>
  <div class="login">
    <el-form ref="loginForm" :model="form" :rules="rules" label-width="80px" class="login-box">
      <h3 class="login-title">系统登录</h3>
      <el-form-item label="账号" prop="username">
        <el-input type="text" placeholder="请输入账号" v-model="form.username" style="width:80%" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" placeholder="请输入密码" v-model="form.password" @keyup.enter.native="onSubmit" style="width:80%" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { login } from "@/api/api.js"; //引入login
import cookies from 'js-cookie'
export default {
  data() {
    return {
      form: {
        username: "",
        password: ""
      },
      // 表单验证，需要在 el-form-item 元素中增加 prop 属性
      rules: {
        username: [
          { required: true, message: "账号不可为空", trigger: "blur" }
        ],
        password: [{ required: true, message: "密码不可为空", trigger: "blur" }]
      }
    };
  },
  methods: {
    onSubmit() {
      // 为表单绑定验证功能
      if(this.form.username == 'admin' && this.form.password == 'gd123456'){
        this.$router.push("/order");
      }else{
        return this.$message({
          message: '请输入正确的账号密码',
          type: 'warning'
        });
      }
      cookies.set('token', 'hs3df3453452451', { expires: 1 } )
      // login(this.form).then(res => {
      //   if (res.status === 200) {
      //     console.log(res.data);
      //     if (res.data.rst === 1) {
      //       this.$router.push("/dashboard");
      //       localStorage.setItem("uesrname", res.data.data.username);
      //       localStorage.setItem("token", res.data.data.token);
      //     } else if (res.data.rst === 0) {
      //       this.$message.error(res.data.msg);
      //     }
      //   }
      // })
    },
  },
  

};
</script>
<style scoped>
.login {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #2D3A4B;
}
.login-p {
  width: 1200px;
  /* margin: 0 auto; */
  text-align: center;
  font-size: 30px;
  color: #3e3e3e;
  margin-top: 40px;
}
.login-box {
  border: 1px solid #dcdfe6;
  width: 450px;
  height: 310px;
  padding: 35px 35px 15px 35px;
  border-radius: 15px;
  -webkit-border-radius: 15px;
  -moz-border-radius: 15px;
  box-shadow: 0 0 25px #909399;
  box-sizing: border-box;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -155px;
  margin-left: -225px;
  background: #8993af;
}

.login-title {
  text-align: center;
  margin: 0 auto 40px auto;
  color: #fff;
  font-size: 24px;
  font-weight: bold;
}
.el-button {
  width: 80%;
}
.el-button span {
  font-size: 16px;
}
.dialog-footer button {
  width: 70px;
  text-align: center;
  font-size: 14px;
}
</style>

