<template>
  <div class="report">
     <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
      <div id="main" style="width: 600px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts';
import _ from 'lodash'
export default {
name:'Report',
data () {
return {
  options: {
          title: {
            text: '用户来源'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#E9EEF3'
              }
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              boundaryGap: false
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ]
        },
    result:{}
}
},
// dom渲染完后 使用echarts
async mounted () {
  // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));
        // 获取数据
        // 钩子函数mounted中无法获取到在created钩子函数中完成赋值的全局变量
        var {data:res}=await this.$http.get('reports/type/1')
        if(res.meta.status!=200){
          return this.$message.error('获取数据报表数据失败')
        }
        var result=_.merge(res.data,this.options)
        // 使用刚指定的配置项和数据显示图表。     
         myChart.setOption(result);
        
}
}
</script>

<style>

</style>