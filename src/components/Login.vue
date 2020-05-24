<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 图片区域 -->
      <div class="avater_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <!-- 表单区域 -->
      <el-form class="input" :model='loginForm' :rules="rules" ref="formRef">
        <!-- 用户名 -->
        <el-form-item prop='username'>
          <el-input prefix-icon="el-icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop='password'>
          <el-input prefix-icon="el-icon-lock" v-model="loginForm.password" type='password'></el-input>
        </el-form-item>
      </el-form>
      <el-row class="button">
        <el-button type="primary" @click="login">登录</el-button>
        <el-button type="info" @click="resetForm">重置</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
import {request} from '../network/require';

export default {
name:'Login',
data () {
  return {
    //表单数据绑定对象
    loginForm:{
      username:'admin',
      password:'123456'
    },
    //表单登录规则对象
    rules:{
      // 用户名登陆规则
      username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        // 密码输入规则
      password:[
        { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
      ]
    }
  }
},
methods: {
  //重置表单
  resetForm(){
    this.$refs.formRef.resetFields()
  },
  //预验证表单
  login(){
    this.$refs.formRef.validate(async res=>{
      if(!res) return;
      var {data:res}=await this.$http.post('login',this.loginForm)
      if(res.meta.status!=200){
        this.$message.error('登录失败');
      }
      else{
      this.$message({
          message: '登录成功',
          type: 'success'
        });
        window.sessionStorage.setItem('token',res.data.token)
      this.$router.push('home')
      }
      
      // console.log(res);
    })
  }
}
}
</script>

<style lang="less" scoped>
.login_container{
  background-color: cornflowerblue;
  height: 100%;

}
.login_box{
  width: 450px;
  height: 300px;
  background-color: #ffffff;
  border-radius: 15px;
  position: absolute;
  left: 50%;
  top:50%;
  transform: translate(-50%,-50%);
  .avater_box{
    width: 120px;
    height: 120px;
    background-color: #fff;
    border-radius: 50%;
    padding: 10px;
    border: 1px solid #eeeeee;
    box-shadow: 0 0 10px #dddddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    img{
      width: 100%;
      height: 100%;
       border-radius: 50%;
       background-color: #eeeeee;
    }
  }
}
.input{
 width: 80%;
 position: absolute;
 left: 50%;
 top:50%;
 transform: translate(-50%,-50%);
}
.button{
position: absolute;
bottom: 35px;
right: 45px;
}
</style>