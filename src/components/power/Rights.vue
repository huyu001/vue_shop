<template>
  <div class="rights">
   <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <el-table :data="rightsList" border stripe style="width: 100%">
        <el-table-column type='index'></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="权限路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level==0">一级</el-tag>
            <el-tag type="success" v-else='scope.row.level==1'>二级</el-tag>
            <el-tag type="danger" v-else='scope.row.level==2'>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
name:'Rights',
data () {
  return {
    rightsList:[]
  }
},
created () {
  // 获取所有权限数据
  this.getRightsList()
},
methods: {
  async getRightsList(){
    var {data:res}=await this.$http.get('rights/list')
    this.rightsList=res.data
    console.log(this.rightsList);
  }
}
}
</script>

<style>
.box-card{
  margin-top: 10px;
}
</style>