<template>
  <el-container class="home_container">
    <!-- 头部区 -->
  <el-header class="home_header">
    <div>
      <span>电商后台管理系统</span>
    </div>
    <el-button type="info" @click="logOut">退出</el-button>
  </el-header>
  <!-- 主体区  -->
  <el-container>
    <!-- 侧边栏 -->
    <el-aside :width="ifCollapse?'64px':'200px'" class="home_side">
        <!-- 侧边栏效果 -->
      <div class="toggle" @click="toggleCollapse">|||</div>
      <el-menu
      background-color="#313743"
      text-color="#fff"
      active-text-color="#002147"
      :unique-opened='true'
      :collapse='ifCollapse'
      :router='true'  
      :collapse-transition='false'><!-- 关闭折叠动画 -->
      <!-- //一级菜单 -->
      <el-submenu :index="item.authName" v-for="item in menuName" :key="item.id" >
        <template slot="title">
          <i :class="iconsObj[item.id]" class="iconfont"></i>
          <span>{{item.authName}}</span>
        </template>
        <!-- 二级菜单 -->
          <el-menu-item  v-for="child in item.children"  :index="'/'+child.path" :key="child.id" >
             <i class="el-icon-menu"></i>
             {{child.authName}}
          </el-menu-item>
      </el-submenu>
    </el-menu>
    </el-aside>
   <!-- 内容区 -->
    <el-main class="home_main">
      <!-- welcome路由占位符 -->
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
name:'Home',
data(){
  return{
    menuList:[],
    menuName:[{
      'authName':'用户管理',
      'children':[{'authName':'用户列表','path':'user'}],
      'id':'125',
      'path':'user'
    },{
      'authName':'权限管理',
      'children':[{'authName':'角色列表','path':'roles'},{'authName':'权限列表','path':'rights'}],
      'id':'103',
      'path':'rights'
    },{
      'authName':'商品管理',
      'children':[{'authName':'商品列表','path':'goods'},{'authName':'分类参数','path':'params'},{'authName':'商品分类','path':'categories'}],
      'id':'101',
      'path':'goods'
    },{
      'authName':'订单管理',
      'children':[{'authName':'用户列表','path':'orders'}],
      'id':'102',
      'path':'orders'
    },{
      'authName':'数据统计',
      'children':[{'authName':'数据列表','path':'reports'}],
      'id':'145',
      'path':'reports'
    }],
    //icons对象
    iconsObj:{
      '125':'iconfont iconyonghu',
      '103':'iconfont iconquanxian',
      "101":'iconfont iconshangpin',
      '102':'iconfont icondingdan',
      '145':'iconfont icondata'
    },
    //是否水平折叠收起菜单
    ifCollapse:false
  }
},
methods:{
  logOut(){
    //退出功能：清空本地sessionStorage，强制跳转到登录页面
    window.sessionStorage.clear()
    this.$router.push('login')
  },
  async getMenuList(){
    const {data:res}=await this.$http.get('menus')
    if(res.meta.status!==200) return this.$message.error()
    this.menuList=res.data
    console.log(this.menuList)
  },
  toggleCollapse(){
    this.ifCollapse=!this.ifCollapse
  }
},
created(){
  this.getMenuList()
}
}
</script>

<style lang="less">
.home_container{
  height: 100%;
}
.home_header{
  background-color: #353C3F;
  display: flex;
  justify-content: space-between;
  align-items: center;
  div span{
    color:#fff;
    font-size: 22px;
    letter-spacing: 2px;
  }
}
.home_side{
  background-color: #313743;
  .el-menu{
    border: 0;
  }
}
.home_main{
  background-color: #E8ECF0;
}
.iconfont{
  padding-right: 7px;
}
.toggle{
  height: 25px;
  line-height:25px ;
  text-align: center;
 cursor: pointer;
 letter-spacing: 0.1em;
 color: #fff;
 font-weight: 100;
 font-size: 14px;
}
</style>