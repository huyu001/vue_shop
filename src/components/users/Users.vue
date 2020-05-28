<template>
  <div class="users">
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 搜索区域 -->
      <el-row :gutter="10">
        <el-col :span="10">
          <el-input placeholder="请输入内容" class="input-with-select" v-model="userInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
           <el-button type="primary" @click="addUserDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
     <el-table
      :data="userList"
      border
      style="width: 100%"
      stripe>
      <el-table-column
      type="index">
      </el-table-column>
      <el-table-column
        prop="username"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="email" 
        label="邮箱"
        width="180">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话">
      </el-table-column>
      <el-table-column
        prop="role_name"
        label="角色">
      </el-table-column>
      <el-table-column
        label="状态" >
        <!-- 作用域插槽 -->
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#409EFF"
            inactive-color="#DBDEE0"
            @change="changeUserState(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
       <el-table-column label="操作" width="180px">
         <template slot-scope="scope">
           <el-button type="primary" icon="el-icon-edit" size='mini' @click="showEditUserDialog(scope.row.id)"></el-button>
           <el-button type="danger" icon="el-icon-delete" size='mini' @click="delateUser(scope.row.id)"></el-button>       
           <el-tooltip class="item" effect="dark" content="角色分配" placement="top" :enterable='false'>
             <el-button type="warning" icon="el-icon-setting" size='mini'  @click='setRoles(scope.row)'> </el-button>
           </el-tooltip>
         </template>
      </el-table-column>
     </el-table>  
     <!-- 分页区域      -->
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="userInfo.pagenum"
      :page-sizes="[2, 5, 10, 20]"
      :page-size="userInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addUserDialogVisible"
      width="60%"
      @close='resetForm'>
      <el-form :model="addForm" status-icon :rules="addRules" ref="addForm" label-width="100px" >
        <el-form-item label="用户名" prop="username">
          <el-input type="username" v-model="addForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input type="email" v-model="addForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input type="mobile" v-model="addForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close='editFormClose'>
      <!-- 修改用户信息表单 -->
      <el-form :model="editForm" status-icon :rules="editFormRules" ref="editFormRef" label-width="100px" >
        <el-form-item label="用户名" prop="username">
          <el-input type="username" v-model="editForm.username" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input type="email" v-model="editForm.email" autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input type="mobile" v-model="editForm.mobile" autocomplete="off" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserForm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="setRolesDialog" width="50%">
       <dir>
         <p>当前用户：{{CurrentuserInfo.username}}</p>
         <p>当前角色：{{CurrentuserInfo.role_name}}</p>
         <p>分配角色：
           <el-select v-model="selsectRole" placeholder="请选择" >
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
         </p>
       </dir>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRolesDialog = false">取 消</el-button>
        <el-button type="primary" @click="setNewRole">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
    
  </div>
</template>

<script>
export default {
name:"Users",
data () {
   // 定义验证邮箱和手机号码的验证规则
    var checkEmail=(rule, value, callback)=>{
      // 验证邮箱的正则表达
      rule=/^\w+([-\.]\w+)*@\w+([\.-]\w+)*\.\w{2,4}$/
      if(rule.test(value)){
       return callback()
      }
      callback(new Error('邮箱不符合规则'))
    }
    var checkMobile=(rule, value, callback)=>{
      // 验证邮箱的正则表达
      rule=/^1[3456789]\d{9}$/
      if(rule.test(value)){
       return callback()
      }
      callback(new Error('该手机号码有误'))
    }
  return {
    // 请求参数
    userInfo:{
      query:'',
      pagenum:1,
      pagesize:2
    },
    //需要保存的数据
    userList:[],
    total:0,
    // 控制添加用户对话框的显示与隐藏
    addUserDialogVisible:false,
    // 添加用户表单数据
    addForm:{
      username:'',
      password:'',
      mobile:'',
      email:''
    },
    // 添加用户表单验证规则
    addRules:{
      username:[
        // 第一项验证是否输入
        // 第二项验证输入是否正确
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
      password:[
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ],
      email:[
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator:checkEmail,trigger: 'blur'  }
        ],
      mobile:[
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator:checkMobile,trigger: 'blur'  }
        ]
    },
    // 控制修改用户对话框的显示
    editDialogVisible:false,
    // 保存根据id查询到的用户信息
    editForm:{},
    // 修改用户信息表单验证规则
    editFormRules:{
      email:[
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator:checkEmail,trigger: 'blur'  }
        ],
      mobile:[
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator:checkMobile,trigger: 'blur'  }
        ]
    },
    // 分配角色对话框
    setRolesDialog:false,
    // 所有角色数据
    rolesList:[],
    //当前展示行的角色信息
    CurrentuserInfo:{},
    // 选择的角色Id绑定
    selsectRole:''
  }
},
created () {
  this.getUserList()
},
methods: {
  async getUserList(){
    var {data:res}=await this.$http.get('users',{params:this.userInfo})
    if(res.meta.status!==200) return this.$message.error('获取管理员列表失败')
    this.total=res.data.total
    this.userList=res.data.users   
  },
  //监听页码大小改变
  handleSizeChange(newPageSize){
    this.userInfo.pagesize=newPageSize
    // 改变页码后 重新请求当前页码对应的数据刷新页面
    this.getUserList()
  },
  // 监听页码值改变
  handleCurrentChange(newPageNum){
    this.userInfo.pagenum=newPageNum
    // 改变页码后 重新请求当前页码值对应的数据
    this.getUserList()
  },
  // 监听用户状态改变
  async changeUserState(data){
    var {data:res}=await this.$http.put(`users/${data.id}/state/${data.mg_state}`)
    if(res.meta.status!=200){
      // 状态不允许被修改
      data.mg_state=!data.mg_state
      return this.$message.error('状态改变失败')
    }
    this.$message.success('状态改变成功')
  },
  // 监听添加用户表单的关闭
  resetForm(){
    this.$refs.addForm.resetFields()
  },
  // 点击确定按钮，对整个表单进行校验的方法
  addUser(){
    this.$refs.addForm.validate(async(res)=>{
      if(!res) return;
        // 发起添加用户的网络请求
        var {data:res}=await this.$http.post('users',this.addForm)
        console.log(res);
        if(res.meta.status!=201){
          this.$message.error('添加用户失败')
        }else{
          this.$message.success('添加用户成功')
          //重新请求数据刷新页面
          this.getUserList()
        }
        // 关闭添加用户对话框
        this.addUserDialogVisible=false
    });
  },
  // 显示修改用户对话框
  async showEditUserDialog(id){
    // 根据用户id获取用户数据
    var {data:res}=await this.$http.get(`users/${id}`)
    if(res.meta.status!=200){
      this.$message.error('查询失败')
    }
    // 将查询到的用户信息保存到本地
    this.editForm=res.data
    this.editDialogVisible=true
  },
  // 监听修改表单对话框关闭后的表单重置
  editFormClose(){
    this.$refs.editFormRef.resetFields()
  },
  // 修改用户表单预验证
  editUserForm(){
    this.$refs.editFormRef.validate(async res=>{
      if(!res){
        return 
      }else{
        // 发起数据请求，修改表单数据
      var {data:res}=await this.$http.put(`users/${this.editForm.id}`,{email:this.editForm.email,mobile:this.editForm.mobile})
        if(res.meta.status!=200){
          this.$message.error('更新失败')
        }else{
          this.message.success('更新成功')
          // 重新请求数据，渲染页面
          this.getUserList()
          // 关闭对话框
          this.editDialogVisible = false
        }
     }    
    })
  },
  //删除用户信息
  async delateUser(id){
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
      var {data:res}=await this.$http.delete(`users/${id}`)
      if(res.meta.status!=200){
        return this.$message.error(res.meta.msg)
      }
      // 重新请求数据渲染页面
      this.getUserList()
      this.$message({
            type: 'success',
            message: '删除成功!'
          })
    }
  },
  async setRoles(role){
    this.CurrentuserInfo=role
    // 在展示对话框前 获取所有角色列表
    var {data:res}=await this.$http.get('roles')
    this.rolesList=res.data
    this.setRolesDialog=true
  },
  // 点击确定按钮分配新角色
  async setNewRole(){
    // 判断是否选取 了新角色
    if(!this.selsectRole){
      return this.$message.warning('请选择新角色')
    }
    var {data:res}=await this.$http.put(`users/${this.CurrentuserInfo.id}/role`,{rid:this.selsectRole})
    if(res.meta.status!=200){
      return this.$message.error('设置角色失败')
    }
    this.getUserList()
    this.setRolesDialog=false
  } 
}
}
</script>

<style>
.box-card{
  margin-top: 10px;
}
.el-input{
  width: 400px;
}
.el-table{
  margin-top: 10px;
}
.el-pagination{
 margin: 10px auto 0;
}
.el-select{
  width: 310px!important;
}
.el-input{
  width: 100%;
}
</style>