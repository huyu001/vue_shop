<template>
  <div class="home">
    <el-button type="info" @click="logOut">信息按钮</el-button>
  </div>
</template>

<script>
export default {
name:'Home',
methods:{
  logOut(){
    //退出功能：清空本地sessionStorage，强制跳转到登录页面
    window.sessionStorage.clear()
    this.$router.push('login')
  }
}
}
</script>

<style>

</style>