<template>
  <div class="Cart">
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加角色 -->
      <el-row>
        <el-col>
          <el-button type='primary' @click="addCatogoris">添加分类</el-button>
        </el-col>
      </el-row>
      <treeTable :data='goodsList' show-index :expand-type='false' :selection-type="false" index-text='#' :show-row-hover='false' border :columns='columns'>
        <template slot='isOk' slot-scope="scope">
          <i class="el-icon-circle-check" v-if="scope.row.cat_deleted===false" style="color:green;" ></i>
          <i class="el-icon-close" v-else  style="color:red"></i>
        </template>
        <!-- 排序模板 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level===1" type="success">二级</el-tag>
          <el-tag v-else-if="scope.row.cat_level===2" type="danger">三级</el-tag>
        </template>
        <!-- 操作模板 -->
        <template slot-scope="scope" slot="opt">
           <el-button type="primary" icon="el-icon-edit" size='mini'>编辑</el-button>
           <el-button type="danger" icon="el-icon-delete" size='mini'>删除</el-button>
        </template>
      </treeTable>
      <!-- 分页 -->
       <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="query.pagenum"
      :page-sizes="[5, 10, 15]"
      :page-size="query.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCatogorisDialog"
      width="30%" @close='addCartDialogClose'>
      <el-form :model="catForm" :rules="catFormRules" ref="catFormRef" label-width="100px" >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="catForm.cat_name"></el-input>
          <!-- options绑定数据源 props指定配置数据对象 model将props中的value存放在数组中 -->
        </el-form-item>
        <el-form-item label='父级分类：'>
          <el-cascader expandTrigger='hover' v-model="selectId" :options="parentCatList" :props='casdorProps' clearable change-on-select @change="parentCatListhandleChange" ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCatogorisDialog = false">取 消</el-button>
        <el-button type="primary" @click="addCart">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
name:'Cart',
data () {
  return {
    // 请求数据参数
    query:{
      type:3,
      pagenum:1,
      pagesize:5
    },
    // 需要保存的请求数据
    goodsList:[],
    // 保存商品总数据
    total:0,
    // 表格割裂配置
    columns:[{
      label:'分类名称',
      prop:'cat_name'
    },//自定义模板 type:'template'
    {
      label:'是否有效',
      template:'isOk',//自定义模板名称
      type:'template'
    },{
      label:'排序',
      template:'order',//自定义模板名称
      type:'template'
    },{
      label:'操作',
      template:'opt',//自定义模板名称
      type:'template'
    }
    ],
    // 控制添加分类对话框的显示
    addCatogorisDialog:false,
    // 添加分类的表单
    catForm:{
      cat_name:'',
      cat_pid :0,
      cat_level :0
    },
    // 添加分类表单验证规则
    catFormRules:{
      cat_name:[ { required: true, message: '请输入分类名称', trigger: 'blur' }]
    },
    parentCatList:[],
    casdorProps:{
      label:'cat_name',
      value:'cat_id',
      children:'children'
      
    },
    selectId:[]
  }
},
created () {
  this.getGoodsList()
},
methods: {
  // 请求商品数据
  async getGoodsList(){
    var {data:res}=await this.$http.get('categories',{params:this.query})
    if(res.meta.status!=200){
      return this.$message.error('请求商品数据失败')
    }
    this.total=res.data.total
    this.goodsList=res.data.result
  },
  // 监听分页页面大小handleSizeChange改变的事件
  handleSizeChange(size){
    this.query.pagesize=size
    this.getGoodsList()
  },
  // 监听页码改变事件
  handleCurrentChange(curr){
    this.query.pagenum=curr
    this.getGoodsList()
  },
  // 添加分类对话框确定添加分类事件
  addCatogoris(){
    // 在展示对话框前请求父级数据列表
    this.getParentCatList()
    this.addCatogorisDialog=true
  },
  async getParentCatList(){
    var {data:res}=await this.$http.get('categories',{params:{type:2}})
    if(res.meta.status!=200){
      return this.$message.error('获取数据失败')
    }
    // 将获取的父级数据保存到data中
    this.parentCatList=res.data
  },
  // 监听级联选择器内容发生变化事件
  parentCatListhandleChange(){
    // 如果练级选择器内有内容
    if(this.selectId.length!=0){
      // 重新给catForm赋值
      this.catForm.cat_pid=this.selectId[this.selectId.length-1]
      this.catForm.cat_level=this.selectId.length
    }else{
      // 联机选择器没内容 重置为0
       this.catForm.cat_pid=0
       this.catForm.cat_level=0
    }
  },
  // 添加分类确定
  addCart(){
    this.$refs.catFormRef.validate(async validate=>{
      if(validate){
        var {data:res}=await this.$http.post('categories',this.catForm)
        if(res.meta.status!=201){
          return this.$message.error('创建失败')
        }
        this.$message.success('创建成功')
        this.getGoodsList()
        this.addCatogorisDialog = false
      }
    })
  },
  // 监听添加分类对话框的关闭事件
  addCartDialogClose(){
    // 将表单清空
    this.$refs.catFormRef.resetFields()
    // 将级联选择器清空
    this.catForm.cat_pid=0
    this.catForm.cat_level=0
    this.selectId=[]
  }
}
}
</script>

<style>
.el-card {
    margin-top: 10px!important;
}
.el-button{
  margin-bottom: 10px;
}
</style>