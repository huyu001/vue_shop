<template>
  <div class="addGoods">
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 提示区域 -->
       <el-alert title="添加基本商品信息"  type="info" center show-icon :closable='false'></el-alert>
       <!-- 步骤条 -->
        <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
          <el-step title="基本信息"></el-step>
          <el-step title="商品参数"></el-step>
          <el-step title="商品属性"></el-step>
          <el-step title="商品图片"></el-step>
          <el-step title="商品内容"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
        <!-- 标签页 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position='top'>
          <el-tabs :tab-position="'left'" v-model="activeIndex" :before-leave='beforeLeave' @tab-click='tabClick'>
            <el-tab-pane label="基本信息" name='0'>
              <el-form-item label='基本信息' prop='goods_name'>
                <el-input v-model="addForm.goods_name"></el-input>
              </el-form-item>
              <el-form-item label='商品价格' prop='goods_price'>
                <el-input v-model="addForm.goods_price" type='number'></el-input>
              </el-form-item>
              <el-form-item label='商品重量' prop='goods_weight'>
                <el-input v-model="addForm.goods_weight" type='number'></el-input>
              </el-form-item>
              <el-form-item label='商品数量' prop='goods_number'>
                <el-input v-model="addForm.goods_number" type='number'></el-input>
              </el-form-item>
              <el-form-item label='商品分类' prop=''>
                <el-cascader v-model="addForm.goods_cat" :options="catList" :props="addCascader" expandTrigger='hover'  @change="handleChange"></el-cascader>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品参数" name='1'>
              <!-- 渲染商品参数 -->
              <el-form-item v-for="item in manyTableData" :label='item.attr_name' class="manyLabel" :key='item.attr_id'>
                <!-- 多选框 -->
                <el-checkbox-group  v-model="item.attr_vals">
                  <el-checkbox border v-for="(cb,i) in item.attr_vals" :label="cb" :key="i" @change='change'></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品属性" name='2'>
              <el-form-item v-for="(item,i) in onlyTableData" :key='i' :label='item.attr_name'>
                <el-input v-model="item.attr_vals"></el-input>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品图片" name='3'>
              <!-- action为图片上传的api接口地址 -->
              <!-- 该组件没有使用axios发送请求 内部没有为请求头中封装Authorization字段 无法进行身份验证 需要我们手动配置 -->
              <!-- headers设置上传的请求头部 -->
              <el-upload action="http://119.23.53.78:8888/api/private/v1/upload" :on-preview="handlePreview"
                :on-remove="handleRemove"  list-type="picture" :headers='headersObj' :on-success='uploadSuccess'>
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-tab-pane>
            <el-tab-pane label="商品内容" name='4'>
              <quill-editor v-model="addForm.goods_introduce"></quill-editor>
              <el-button type='primary' @click="add">添加商品</el-button>
            </el-tab-pane>
          </el-tabs>
        </el-form>
    </el-card>
    <!-- 图片预览对话框 -->
    <el-dialog  :visible.sync="previewDialogVisible" width="30%">
      <img :src="previewPath" alt="">
    </el-dialog>

  </div>
</template>

<script>
import _ from 'lodash'
export default {
name:'AddGoods',
data () {
  return {
    // 标签活跃项
    activeIndex:'0',
    // 添加表单对象
    addForm:{
      goods_name:'',
      goods_price:0,
      goods_weight:0,
      goods_number:0,
      // 商品分类数组
      goods_cat:[],
      pics:[],
      // 商品描述
      goods_introduce:'',
      attrs:[]
    },
    // 添加表单验证规则
    addFormRules:{
      goods_name:[ { required: true, message: '名称不能为空'}],
      goods_price:[ { required: true, message: '价格不能为空'}],
      goods_weight:[ { required: true, message: '重量不能为空'}],
      goods_number:[ { required: true, message: '年龄不能为空'}]
    },
    // 商品分类数据
    catList:[],
    // 级联选择器配置
    addCascader:{
      label:'cat_name',
      value:'cat_id',
      children:'children'
    },
    // 商品动态参数数据
    manyTableData:[],
    // 静态属性
    onlyTableData:[],
    // 图片上传请求头
    headersObj:{
      Authorization:window.sessionStorage.getItem('token')
    },
    // 控制预览图片对话框的显示隐藏
    previewDialogVisible:false,
    // 预览图片的路径
    previewPath:''
  }
},
created () {
  // 获取商品分类数据
  this.getCatList()
},
methods: {
  // 获取商品分类数据
  async getCatList(){
    var {data:res}=await this.$http.get('categories')
    if(res.meta.status!=200) return this.$message.error('获取分类数据失败')
    this.catList=res.data
  },
  // 监听级联选择器选项的改变事件
  handleChange(){
    console.log(this.addForm.goods_cat);
    if(this.addForm.goods_cat.length!==3){
      this.addForm.goods_cat=[]
    }
  },
  // tab页切换
  beforeLeave(activeName, oldActiveName){
    // if(oldActiveName==='0'&&this.addForm.goods_cat.length!=3){
    //   this.$message.error('请先选择商品分类！')
    //   return false
    // }
  },
  // 监听标签点击事件
  async tabClick(){
    if(this.activeIndex=='1'){
      var {data:res}=await this.$http.get(`categories/${this.catId}/attributes`,{params:{
        sel:'many'
      }})
      if(res.meta.status!=200){
        return this.$message.error('获取参数失败')
      }
      this.manyTableData=res.data
      // 多选框数据绑定是个数组 因此需要将数据类型由字符串转成数组
      // 字符串为空就转成空数组
      this.manyTableData.forEach(item=>{
      item.attr_vals=item.attr_vals===''?[]:item.attr_vals.split(' ')
      })
      console.log(this.manyTableData);
  }else if(this.activeIndex==='2'){
     var {data:res}=await this.$http.get(`categories/${this.catId}/attributes`,{params:{
        sel:'only'
      }})
      if(res.meta.status!=200){
        return this.$message.error('获取参数失败')
      }
      this.onlyTableData=res.data
      console.log(this.onlyTableData);
  }
} ,
// 监听复选框绑定值变化时触发的事件
change(){
  console.log(this.manyTableData);
},
// 监听图片预览事件
handlePreview(file){
this.previewPath=file.response.data.url
this.previewDialogVisible=true
},
// 监听图片移出事件
handleRemove(file){
// 图片地址
var filePath=file.response.data.tmp_path
// 根据图片地址 找到图片在数组中对应的下标
var index=this.addForm.pics.findIndex(item=>{
  item.pic==filePath
})
// 删除该下表对应的数据
this.addForm.pics.splice(index,1)

},
// 图片上传成功回调函数
uploadSuccess(response){
console.log(response);
var pic={pic:response.data.tmp_path}
this.addForm.pics.push(pic)
console.log(this.addForm);
},
add(){
  console.log(this.addForm);
  this.$refs.addFormRef.validate(async validate=>{
    if(!validate){
      return this.$message.error('请填写必要的表单项')
    }else{
    // 提交表单
      // 由于服务器规定提交表单的goods_cat字段的类型为string 
      // 所以需要先将goods_cat由数组转成string
      // 但是级联选择器绑定也是该数据 并且要求其类型是数组
      // 所以我们不能直接修改addform
      // 需要拷贝一个新的form 修改此form 将此form传至服务端
      // 用lodash 的cloneDeep（obj）
      var form=_.cloneDeep(this.addForm)
      form.goods_cat=form.goods_cat.join(',')
      // 处理动态参数
      this.manyTableData.forEach(item=>{
        var newInfo={attr_id:item.attr_id,attr_values:item.attr_vals.join(' ')}
        this.addForm.attrs.push(newInfo)
      })
      // 处理静态属性
      this.onlyTableData.forEach(item=>{
        var newInfo={attr_id:item.attr_id,attr_values:item.attr_vals}
        this.addForm.attrs.push(newInfo)
      })
      form.attrs=this.addForm.attrs
      // 发送商品添加请求
      var {data:res}=await this.$http.post('goods',form)
      if(res.meta.status==201){
        this.$message.success('创建商品成功')
        this.$router.push('/goods')
      }
    }
  })  
}  
},
computed: {
  catId(){
    if(this.addForm.goods_cat.length===3){
      return this.addForm.goods_cat[2]
    }
    return null
  }
}
}
</script>

<style>
.el-steps{
  margin: 15px 0;
  font-size: 13px;
}
.el-button{
  margin-top: 10px;
}

</style>