<template>
  <div class="goodsList">
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 头部搜索区域 -->
      <el-row :gutter="20">
        <el-col :span='10'>
          <el-input placeholder="请输入内容" v-model="quryInfo.query" clearable @clear='getGoodsList'>
           <el-button slot="append" icon="el-icon-search" @click='getGoodsList'></el-button>
          </el-input>
        </el-col>
        <el-col :span='4' >
          <el-button type="primary" @click='goAddPage'>添加商品</el-button>
        </el-col>
      </el-row>
      <!-- table区域 -->
      <el-table :data='goodsList' border stripe>
        <el-table-column type='index'></el-table-column>
        <el-table-column label='商品名称' prop='goods_name'></el-table-column>
        <el-table-column label='商品价格' prop='goods_price' width='120px'></el-table-column>
        <el-table-column label='商品重量' prop='goods_weight' width='80px'></el-table-column>
        <el-table-column label='创建时间' prop='add_time' width='120px'></el-table-column>
        <el-table-column label='操作' width='150px'>
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size='mini'></el-button>
            <el-button type="danger" icon="el-icon-delete" size='mini' @click="deleteGoods(scope.row)"></el-button>
          </template>
        </el-table-column>
      
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="quryInfo.pagenum"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="quryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
name:'GoodsList',
data () {
  return {
    // 请求参数信息
    quryInfo:{
      pagenum:1,
      pagesize:10,
      query:''
    },
    // 保存商品总数
    total:0,
    // 保存商品列表数据
    goodsList:[]
  }
},
created () {
  // 请求数据
    this.getGoodsList()
},
methods: {
  // 获取商品数据
  async getGoodsList(){
    var {data:res}=await this.$http.get('goods',{params:this.quryInfo})
    console.log(res);
    if(res.meta.status!==200){
      return this.$message.error('获取商品数据失败')
    }
    // 保存数据
    this.goodsList=res.data.goods
    this.total=res.data.total
  },
  // 监听页数大小改变
  handleSizeChange(size){
    this.quryInfo.pagesize=size
    this.getGoodsList()
  },
  // 当前页码改变
  handleCurrentChange(num){
    this.quryInfo.pagenum=num
    this.getGoodsList()
  },
  // 
  deleteGoods(row){
    this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          var {data:res}=await this.$http.delete(`goods/${row.goods_id}`)
          console.log(res);
          if(res.meta.status!=200){
            return this.$message.error('删除失败')
          }
          this.getGoodsList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
  },
  // 到添加商品页面
  goAddPage(){
    this.$router.push('/goods/add')
  }
}
}
</script>

<style>
el-input{
  margin-right: -50px;
}
</style>