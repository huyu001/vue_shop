<template>
  <div class="params">
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 警告区域 -->
      <el-alert class="alert"
        title="注意，只允许为三级分类设置相关参数" :closable='false'
        type="warning"
        show-icon>
      </el-alert>
      <el-row class="cat_">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 级联选择器 -->
          <el-cascader expandTrigger='hover' v-model="cascaderModel" :options="cateList" :props="cascaderProps" @change="handleChange"></el-cascader>
        </el-col>
      </el-row>
      <!-- 标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="only">
          <!-- 添加属性 -->
          <el-button type='primary' :disabled='isDisabled' @click="addDialog">添加参数</el-button>
          <!-- 表格区域 -->
          <el-table :data='onlyTableData' border>
            <!-- 展开列 -->
            <el-table-column type='expand'>
              <template slot-scope="scope">
                <!-- 标签显示 -->
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key='i' closable @close='closeTag(i,scope.row)'>{{item}}</el-tag>
                <!-- 文本框与按钮显示 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                 ref="saveTagInputRef" size="small" @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type='index'></el-table-column>
            <!-- 表格内容 -->
            <el-table-column  prop="attr_name"  label="参数名称"></el-table-column>
            <el-table-column label='操作'>
              <template slot-scope="scope">
                <el-button type="primary" size='mini' icon="el-icon-edit" @click="editParams(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" size='mini' icon="el-icon-delete" @click="deleteParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="many">
          <el-button type='primary' :disabled='isDisabled'@click="addDialog">添加属性</el-button>
          <!-- 表格区域 -->
          <el-table :data='manyTableData' border>
            <!-- 展开列 -->
            <el-table-column type='expand'>
              <template slot-scope="scope">
                <!-- 标签显示 -->
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key='i' closable @close='closeTag(i,scope.row)'>{{item}}</el-tag>
                <!-- 文本框与按钮显示 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                 ref="saveTagInputRef" size="small" @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type='index'></el-table-column>
            <!-- 表格内容 -->
            <el-table-column  prop="attr_name"  label="属性名称"></el-table-column>
            <el-table-column label='操作'>
              <template slot-scope="scope">
                <el-button type="primary" size='mini' icon="el-icon-edit" @click="editParams(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" size='mini' icon="el-icon-delete" @click="deleteParams(scope.row.attr_id)">删除</el-button>

              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加对话框 -->
    <el-dialog
      :title="'添加'+addName"
      :visible.sync="addDialogVisible"
      width="30%" @close='addDialogClose'>
      <!-- 表单区域 -->
      <el-form :model="addRuleForm" :rules="addRule" ref="addRuleFormRef" label-width="100px">
        <el-form-item :label="addName" prop="attr_name">
          <el-input v-model="addRuleForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数对话框 -->
    <el-dialog 
      :title="'修改'+addName"
      :visible.sync="editDialogVisible"
      width="30%" @close='editDialogClose'>
      <!-- 表单区域 -->
      <el-form :model="editRuleForm" :rules="editRule" ref="editRuleFormRef" label-width="100px">
        <el-form-item :label="addName" prop="attr_name">
          <el-input v-model="editRuleForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParamsSure">确 定</el-button>
      </span>
    </el-dialog>
    
  </div>
</template>

<script>
export default {
name:'Params',
data () {
  return {
    cateList:[],
    // 级联选择器配置对象
    cascaderProps:{
      value:'cat_id',
      children:'children',
      label:'cat_name'
    },
    //级联选择器数据双向绑定
    cascaderModel:[],
    // tags活跃标签名
    activeName:'only',
    // table绑定数据
    manyTableData:[],
    onlyTableData:[],
    // add对话框显示隐藏
    addDialogVisible:false,
    // 添加表单数据绑定
    addRuleForm:{attr_name:''},
    // 添加表单验证规则
    addRule:{attr_name:[{ required: true, message: '请输入信息', trigger: 'blur' }]},
    // 编辑对话框显示隐藏
    editDialogVisible:false,
    // 编辑表单数据绑定
    editRuleForm:{attr_name:''},
    // 编辑表单验证规则
    editRule:{attr_name:[{ required: true, message: '请输入信息', trigger: 'blur' }]},
    attr_id:0,
    // // 控制文本框的显示隐藏
    // inputVisible:false,
    // // 绑定文本框内容
    // inputValue:''
  }
},
created () {
  this.getGoodsList()
},
methods: {
  async getGoodsList(){
    var {data:res}=await this.$http.get('categories')
    if(res.meta.status!=200){
      return this.$message.error('请求数据失败')
    }
    this.cateList=res.data
  },
  // 监听级联选择器选项的改变
  handleChange(){
    if(this.cascaderModel.length!==3){
      this.cascaderModel=[]
      this.manyTableData=[]
      this.onlyTableData=[]
    }else{
      this.getParamsData()
    }
  },
  // 监听tabs标签页的点击事件
  handleClick(tab,event){
    this.getParamsData()
  },
  // 获取参数数据
  async getParamsData(){
    var {data:res}=await this.$http.get(`categories/${this.catId}/attributes`,{params:{sel:this.activeName}})
      if(res.meta.status!=200){
        return this.$message.error('获取参数数据列表失败')
    }
      
      // 将attr_vals类型由字符串转变成数组
      res.data.forEach(item=>{
        if(!item.attr_vals){
          // 为对象增加一个属于自己的控制输入框显示与隐藏属性
        item.inputVisible=false
        // 为对象增加一个属于自己的输入框绑定的数据
        item.inputValue=''
        item.attr_vals=item.attr_vals.split(' ')
        item.attr_vals.pop()
        return ;
        }
        item.attr_vals=item.attr_vals.split(' ')
        // 为对象增加一个属于自己的控制输入框显示与隐藏属性
        item.inputVisible=false
        // 为对象增加一个属于自己的输入框绑定的数据
        item.inputValue=''
      })
      console.log(res.data);
      
      if(this.activeName==='many'){
        this.manyTableData=res.data
      }else{
        this.onlyTableData=res.data
      }
      
  },
  // 添加对话框显示
  addDialog(){
    this.addDialogVisible=true
  },
  // 监听添加表单对话框关闭事件
  addDialogClose(){
    this.$refs.addRuleFormRef.resetFields()
  },
  // 确认添加表单
   addParams(){
    this.$refs.addRuleFormRef.validate(async validate=>{
      if(!validate) return ;
      var {data:res}=await this.$http.post(`categories/${this.catId}/attributes`,
      {attr_name:this.addRuleForm.attr_name,attr_sel:this.activeName})
      if(res.meta.status!=201) return this.message.error('添加商品失败')
      this.$message.success('添加商品成功')
      this.getParamsData()
      this.addDialogVisible=false
    })    
  },
  // 监听编辑表单关闭事件
  editDialogClose(){
    this.$refs.editRuleFormRef.resetFields()
  },
  // 点击编辑按钮
  async editParams(attr_id){
    this.attr_id=attr_id
    var {data:res}=await this.$http.get(`categories/${this.catId}/attributes/${attr_id}`,{
      params:{attr_sel :this.activeName}      
    })
    if(res.meta.status!=200) return this.$message.error('获取失败')
    this.editRuleForm.attr_name=res.data.attr_name
    this.editDialogVisible=true
  },
  // 编辑参数确定
  async editParamsSure(){
    var {data:res}=await this.$http.put(`categories/${this.catId}/attributes/${this.attr_id}`,{attr_name:this.editRuleForm.attr_name,attr_sel:this.activeName})
    if(res.meta.status!=200){
      return this.$message.error('更新失败')
    }
    this.getParamsData()
    this.$message.success('更新成功')
    this.editDialogVisible=false
  },
  // 删除参数
  async deleteParams(attr_id){ 
     var res=await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
    if(res=='cancel'){
      this.$message({
            type: 'info',
            message: '已取消删除'
          })
    }else{
      var {data:res}=await this.$http.delete(`categories/${this.catId}/attributes/${attr_id}`)
      if(res.meta.status!=200){
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.getParamsData()
    }
  },
  // 监听关闭tag事件
  closeTag(i,row){
    // 将第i个标签删除
    row.attr_vals.splice(i,1)
    // 将删除后的数据保存至数据库
     var msg='删除参数'
     this.saveAttrVals(row,msg)
     
     
  },
  // 文本框失去焦点或者按下enter触发的事件
   handleInputConfirm(row){
    // 如果文本框的内容为空 不保存内容
    if(row.inputValue.trim().length===0){
      row.inputValue=''
      row.inputVisible=false
    }else{
      row.attr_vals.push(row.inputValue)
      row.inputValue=''
      row.inputVisible=false
      // 将修改后的数据保存到后台数据库中
      var msg='添加参数'
      this.saveAttrVals(row,msg)
    }  
  },
  // 将修改后的数据保存到数据库中
  async saveAttrVals(row,msg){
    var {data:res}=await this.$http.put(`categories/${this.catId}/attributes/${row.attr_id}`,{
      attr_name:row.attr_name,
      attr_sel:this.activeName,
      attr_vals:row.attr_vals.join(' ').trim()
    })
    if(res.meta.status!=200){
      return this.$message.error('数据更新失败')
    }
    this.$message.success(msg+'成功')
},
  // 点击按钮触发的事件
  showInput(row){
    row.inputVisible=true
    // 文本框获得焦点
    // $nextTick作用：当页面元素被重新渲染完毕后，才会调用函数里面的代码
    // input为DOM元素 需要在页面元素渲染出来后才拿得到
    this.$nextTick(_ => {
      this.$refs.saveTagInputRef.$refs.input.focus();
    });
  }
},
computed: {
  // 根据是否选择三级商品判断是否禁用
  isDisabled(){
    if(this.cascaderModel.length!==3){
      return true
    }else{
      return false
    }
  },
  // 动态id属性
  catId(){
    if(this.cascaderModel.length==3){
      return this.cascaderModel[2]
    }
  },
  // 动态选择name属性
  addName(){
    if(this.activeName=='only'){
      return '动态参数'
    }else{
      return '静态属性'
    }
  },
  
}
}
</script>

<style>
.cat_{
  margin: 10px 0 0;
}
.input-new-tag{
  width: 100px;
}
.el-tag{
margin: 10px;
}
</style>