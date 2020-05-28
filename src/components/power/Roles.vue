<template>
  <div class="roles">
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加角色 -->
      <el-row>
        <el-col>
          <el-button type='primary' @click="addRolesDialog">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 添加角色对话框 -->
      <el-dialog title="添加角色" :visible.sync="dialogFormVisible">
        <el-form :model="addRolesInfo">
          <el-form-item label="角色名称" label-width="120px">
            <el-input v-model="addRolesInfo.roleName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" label-width="120px">
            <el-input v-model="addRolesInfo.roleDesc" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRoles">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 表格区域 -->
      <el-table :data="rolesList" border stripe style="width: 100%">
         <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item,i1) in scope.row.children" :key="item.id"  :class="['bdbottom',i1===0?'bdtop':'']" class="row">
              <!-- 一级权限 -->
              <el-col :span='6' class="vcenter">
                <el-tag closable @close='deleteRights(scope.row,item.id)'>{{item.authName}}</el-tag><i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二三级权限 -->
              <el-col :span='18'>
                <el-row v-for="(item,i2) in item.children" :key="item.id" :class="i2===0?'':'bdtop'">
                  <!-- 二级权限 -->
                  <el-col :span='6' class="vcenter">
                    <el-tag type='success' closable @close='deleteRights(scope.row,item.id)'>{{item.authName}}</el-tag><i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span='18'>
                    <el-row  v-for="(item3,i3) in item.children" :key="item3.id" :class="i3===0?'':'bdtop'">
                      <el-tag closable @close='deleteRights(scope.row,item3.id)'>{{item3.authName}}</el-tag>
                    </el-row> 
                  </el-col>          
                </el-row>
              </el-col>
            </el-row>
          </template>
          
        </el-table-column>
        <el-table-column type='index'></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column  label="操作">
          <template slot-scope="scope">
            <el-button type='primary' size='mini' icon="el-icon-edit" @click="editRolesDialog(scope.row)">编辑</el-button>
            <el-button type='danger' size='mini' icon="el-icon-delete" @click="deleteRoles(scope.row.id)">删除</el-button>
            <el-button type='warning' size='mini' icon="el-icon-edit" @click="showSetRightsDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
      <!-- 编辑角色 -->
      <el-dialog title="编辑角色" :visible='editDialog'>
        <el-form :model="editRolesInfo">
          <el-form-item label="角色名称" label-width="120px">
            <el-input v-model="editRolesInfo.roleName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" label-width="120px">
            <el-input v-model="editRolesInfo.roleDesc" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialog = false">取 消</el-button>
          <el-button type="primary" @click="editRoles">确 定</el-button>
        </div>
      </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog title="提示" :visible.sync="showSetRights" width="30%" @close='setRightsDialog'>
      <el-tree ref='rightsTreeRef' :data="rightsList" :props="treeProps" show-checkbox node-key='id' default-expand-all :default-checked-keys='defKey'></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showSetRights = false">取 消</el-button>
        <el-button type="primary" @click="distriRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
name:'Roles',
data () {
  return {
    rolesList:[],
    // 控制添加角色对话框
    dialogFormVisible:false,
    // 添加角色表单绑定数据
    addRolesInfo:{
      roleName:'',
      roleDesc:''
    },
    // 控制编辑角色对话框
    editDialog:false,
    // 编辑角色表单绑定数据
    editRolesInfo:{
      roleName:'',
      roleDesc:'',
      id:''
    },
    // 分配权限对话框
    showSetRights:false,
    // 权限数据
    rightsList:[],
    // 树结构属性绑定对象
    treeProps:{
      children: 'children',
      label: 'authName',
      id:'id'
    },
    // 默认勾选的节点数组
    defKey:[],
    // 保存当前角色ID
    roleId:''
  }
},
created () {
  // 请求角色列表数据
  this.getRolesList()
},
methods: {
  // 获取数据
  async getRolesList(){
    var {data:res}=await this.$http.get('roles')
    if(res.meta.status!=200){
      this.$message.error('获取数据失败')
    }
    this.rolesList=res.data
  },
  // 打开添加角色对话框
  addRolesDialog(){
    // this.$http.post('roles')
    this.dialogFormVisible = true
  },
  //添加角色
  async addRoles(){
    var {data:res}=await this.$http.post('roles',this.addRolesInfo)
    if(res.meta.status==400){
      this.$message.error(res.meta.msg)
    }else{
      this.$message.success(res.meta.msg)
      // 重新渲染页面
      this.getRolesList()
      // 关闭对话框
      this.dialogFormVisible=false
    }
  },
  // 删除角色
   deleteRoles(id){
    //  弹框确认删除
    this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          var {data:res}=await this.$http.delete(`roles/${id}`)
          if(res.meta.status==200){
            this.$message({
            type: 'success',
            message: res.meta.msg
          })
            // 重新请求数据 渲染页面
            this.getRolesList()
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })         
        })
    
  },
  // 编辑角色对话框
  editRolesDialog(data){
    this.editRolesInfo.roleName=data.roleName
    this.editRolesInfo.roleDesc=data.roleDesc
    this.editRolesInfo.id=data.id
    this.editDialog=true
  },
  //编辑角色信息并提交
  async editRoles(){
    var {data:res}=await this.$http.put('roles/'+this.editRolesInfo.id,{roleName:this.editRolesInfo.roleName,roleDesc:this.editRolesInfo.roleDesc})
    if(res.meta.status!=200){
      this.$message.success('修改失败')
    }else{
      this.$message.success('修改成功')
      this.editDialog=false
      this.getRolesList()
    }
  },
  // 删除权限
  deleteRights(role,rightsId){
    //  弹框确认删除
    this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          var {data:res}=await this.$http.delete(`roles/${role.id}/rights/${rightsId}`)
          if(res.meta.status==200){
            role.children=res.data
            this.$message({
            type: 'success',
            message: '删除成功'
          })
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })         
        })
    console.log(role);
  },
  //获取权限
  async showSetRightsDialog(role){
    var {data:res}=await this.$http.get('rights/tree')
    if(res.meta.status!=200){
     return this.$message.error('获取权限失败')
    }
    // 将删除数据后的数据进行绑定 完成页面的局部刷新
    // 使用this.getgetRolesList 会重新请求全部数据 经行页面的全部刷新
    this.rightsList=res.data
    // 递归访问根节点
    this.getNodeKey(role,this.defKey)
    this.roleId=role.id
    this.showSetRights=true
  },
  // 递归获取节点的key
  getNodeKey(node,arr){
    // 如果节点没有子节点 递归结束
    if(!node.children){
      return arr.push(node.id)
    }
    // 若节点还有子节点 则继续遍历子节点
    node.children.forEach(item=>{
      this.getNodeKey(item,arr)
    })
  },
  // 监听设置权限对话框的关闭
  setRightsDialog(){
    // 重置this.defKey
    this.defKey=[]
  },
  // 分配权限
  async distriRights(){
    const keys=[...this.$refs.rightsTreeRef.getCheckedKeys(),...this.$refs.rightsTreeRef.getHalfCheckedNodes()]
    const keysStr=keys.join(',')
    console.log(keys);
    var {data:res}=await this.$http.post(`roles/${this.roleId}/rights`,{rids:keysStr})
    if(res.meta.status!==200){
      return this.$message.error('分配权限失败')
    }
    this.getRolesList()
    this.$message.success('分配权限成功')
    this.showSetRights = false
  }
}
}
</script>

<style>
.el-row{
}
.el-tag{
  margin: 5px;
}
.bdtop{
  border-top: 1px solid #eee;
}
.bdbottom{
  border-bottom: 1px solid #eee;
}
.vcenter{
margin: 50px 0px;
}
</style>