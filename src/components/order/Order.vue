<template>
  <div class="order">
     <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
  
  <!-- 卡片区域 -->
  <el-card>
    <el-row>
      <el-col :span='8'>
        <el-input placeholder="请输入内容"  clearable >
           <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
    </el-row>
    <!-- 订单表格 -->
    <el-table :data='orderList' border stripe>
      <el-table-column type='index'></el-table-column>
      <el-table-column label="订单编号" prop='order_number'></el-table-column>
      <el-table-column label="订单价格" prop='order_price'  width="90"></el-table-column>
      <el-table-column label="是否付款" prop='order_pay' width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.order_pay==='1'">是</el-tag>
          <el-tag type='success' v-else>否</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否发货" prop="is_send"  width="90"></el-table-column>
      <el-table-column label="下单时间" prop="create_time">
        <template slot-scope="scope">
          {{scope.row.create_time|filterTime}}
        </template>
      </el-table-column>
      <el-table-column label="操作" >
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size='mini' @click="showAdressDialog"></el-button>
          <el-button type="success" icon="el-icon-location" size='mini' @click="showProgressDialog"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 订单分页 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"
      :page-sizes="[10, 20, 30, 40]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
  </el-card>
  <!-- 修改地址对话框 -->
  <el-dialog title="修改地址" :visible.sync="adressDialogVisible" width="30%" @close='adressClose'>  
    <el-form :model="adressRuleForm" :rules="adressRule" ref="adressRuleFormRef" label-width="100px" class="demo-ruleForm">
      <el-form-item label="请选择地区" prop="adress1">
        <el-cascader v-model="adressRuleForm.adress1" :options="city_data" :props="{ expandTrigger: 'hover' }"
         @change="handleChange"></el-cascader>
      </el-form-item>
      <el-form-item label="详细地址" prop="adress2">
        <el-input v-model="adressRuleForm.adress2"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="adressDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="adressDialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
  <!-- 显示物流对话框 -->
  <el-dialog title="物流信息" :visible.sync="progressDialogVisible" width="50%">  
    <!-- 时间线 -->
    <el-timeline>
      <el-timeline-item
        v-for="(activity, index) in progressInfo"
        :key="index"
        :timestamp="activity.time">
        {{activity.context}}
      </el-timeline-item>
    </el-timeline>
  </el-dialog>
  </div>
</template>

<script>
import city_data from './citys.json';
export default {
name:'Order',
data () {
  return {
    // 请求数据参数信息
    queryInfo:{
      query:'',
      pagenum:1,
      pagesize:10
    },
    // 保存订单数据
    orderList:[],
    // 保存总定的单数
    total:0 ,
    adressDialogVisible:false,
    // 修改地址表单对象
    adressRuleForm:{
      adress1:[],
      adress2:''
    },
    // 修改地址表单验证规则对象
    adressRule:{
      adress1:[{ required: true, message: '请选择区域', trigger: 'blur' }],
      adress2:[{ required: true, message: '请填写详细地址', trigger: 'blur' }]
    },
    // 城市信息三级联动数据
    city_data:city_data,
    progressDialogVisible:false,
    // 保存物流信息
    progressInfo:[]
  }
},
created () {
  this.getOrderList()
},
methods: {
  // 获取数据
  async getOrderList(){
    var {data:res}=await this.$http.get('orders',{params:this.queryInfo})
    if(res.meta.status!=200){
      return this.$message.error('获取数据失败')
    } 
    this.orderList=res.data.goods
    this.total=res.data.total
  },
  // 监听分页器分页大小的改变
  handleSizeChange(pagesize){
    this.queryInfo.pagesize=pagesize
    this.getOrderList()
  },
  // 监听分页器当前页面改变事件
  handleCurrentChange(pagenum){
    this.queryInfo.pagenum=pagenum
    this.getOrderList()
  },
  // 显示地址信息对话框
  showAdressDialog(){
    this.adressDialogVisible=true
  },
  // 监听修改地址对话框的关闭
  adressClose(){
    // 重置表单
    this.$refs.adressRuleFormRef.resetFields()
  },
  // 监听级联选择器选择性的改变
  handleChange(){
    
  },
  //显示物流信息对话框
  async showProgressDialog(){
    // 获取物流数据
    var {data:res}=await this.$http.get(`/kuaidi/1106975712662`)
    if(res.meta.status!=200){
      return this.$message.error('获取物流数据失败')
    }
    this.progressInfo=res.data
    console.log(this.progressInfo);
    this.progressDialogVisible=true
  } 
}
}
</script>

<style>
.el-cascader{
  width: 100%;
}
</style>