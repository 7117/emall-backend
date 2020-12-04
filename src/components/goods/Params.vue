<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert
          show-icon
          title="提示的文案"
          type="success">
      </el-alert>

      <el-row class="cat_opt" :gutter="20">
         <span>
            选择商品分类：
          </span>
        <el-col :span="5">
          <!--          v-model是选中数据的-->
          <!--          options是数据源-->
          <!--          props：checkStrictly是否只能选中最末尾的元素-->
          <!--          props：expandTrigger展开触发方式-->
          <!--          props：value选中的值-->
          <!--          props：label显示的值-->
          <!--          props：children子代元素-->
          <el-cascader
              v-model="selectedCateData"
              clearable
              :options="catelist"
              :props="{
                        expandTrigger: 'hover',
                        value: 'cat_id',
                        label: 'cat_name',
                        children: 'children',
                }"
              @change="handleChangeCate"
          >
          </el-cascader>
        </el-col>
      </el-row>

      <el-tabs v-model="activeName" @tab-click="handleChangeCate">
        <el-tab-pane label="用户管理" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled">添加参数
          </el-button>
        </el-tab-pane>
        <el-tab-pane label="配置管理" name="only" @tab-click="handleChangeCate">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled">添加属性</el-button>
        </el-tab-pane>
      </el-tabs>

    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: 'many',
      catelist: [],
      selectedCateData: [],
      manyTableData: [],
      onlyTableData: []
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async handleChangeCate() {

      const {data: res} = await this.$http.get('categories/' + this.cateId + '/attributes', {
        params: {sel: this.activeName}
      })
      console.log(this.activeName)
      console.log(res.data)

      if (res.meta.status !== 200) {
        return this.$message.error("失败")
      }

      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data

      }


    },
    async getCateList() {
      const {data: res} = await this.$http.get('categories')

      if (res.meta.status !== 200) {
        return this.$message.error("弹出失败")
      }

      this.catelist = res.data
    },
  },
  computed: {
    isBtnDisabled() {
      if (this.selectedCateData.length !== 0) {
        return false
      } else {
        return true
      }
    },
    cateId() {
      if (this.selectedCateData.length !== 0) {
        return this.selectedCateData[this.selectedCateData.length - 1]
      } else {
        return null
      }
    },
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin-top: 15px;
  padding-left: 12px;
  display: flex;
  justify-content: flex-start;
  align-items: center
}
</style>