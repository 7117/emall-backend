<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="成功提示的文案" type="success" center show-icon :closable="true"></el-alert>

      <el-steps :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="步骤 1"></el-step>
        <el-step title="步骤 2"></el-step>
        <el-step title="步骤 3"></el-step>
        <el-step title="步骤 4"></el-step>
        <el-step title="步骤 5"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>


      <el-form label-position="top" :model="addForm" :rules="addFormRules" ref="addFormRef"
               label-width="100px">
        <el-tabs @tab-click="tabClick" v-model="activeIndex" :tab-position="'left'" :before-leave="beforeTab">
          <el-tab-pane label="用户管理" name="0">
            <el-form-item label="活动名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="活动名称" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="活动名称" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="活动名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="活动名称" prop="goods_cat">
              <el-cascader
                  v-model="addForm.goods_cat"
                  clearable
                  :options="catelist"
                  :props="{
                      expandTrigger: 'hover',
                      value: 'cat_id',
                      label: 'cat_name',
                      children: 'children',
              }"
                  @change="parentChangeAction"
              >
              </el-cascader>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="用户管理" name="1">
            <el-form-item
                v-for="item in manyTableData"
                :label="item.attr_name"
                :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                    border
                    v-for="(v,k) in item.attr_vals"
                    :key="k"
                    :label="v"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="用户管理" name="2">
            <el-form-item
                v-for="itemthr in onlyTableData"
                :label="itemthr.attr_name"
            >
              <el-input v-model="itemthr.attr_vals">
              </el-input>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="点击上传" name="3">
            <el-upload
                :on-success="handleSuccess"
                :action="uploadUrl"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                list-type="picture"
                :headers="headObj"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>

          <el-tab-pane label="其他按钮" name="4">
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <el-dialog
        title="提示"
        :visible.sync="previewVisible"
        width="50%"
    >
      <img :src="previewPath" class="previewImg">
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {

      headObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      selectedData: [],
      addFormRules: {
        goods_name: [{required: true, message: '请输入活动名称', trigger: 'blur'},],
        goods_price: [{required: true, message: '请输入活动名称', trigger: 'blur'},],
        goods_weight: [{required: true, message: '请输入活动名称', trigger: 'blur'},],
        goods_number: [{required: true, message: '请输入活动名称', trigger: 'blur'},],
        goods_cat: [{required: true, message: '请输入活动名称', trigger: 'blur'},],
      },
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
      },
      activeIndex: '0',
      catelist: [],
      activeSed: '',
      activeName: '',
      oldActiveName: '',
      manyTableData: [],
      onlyTableData: [],
      previewPath: '',
      previewVisible: false,
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    handlePreview(file) {
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    handleRemove(file) {
      const filePath = file.response.data.tmp_path
      const i = this.addForm.pics.findIndex(x => x.pic === filePath)
      this.addForm.pics.splice(i, 1)
      console.log(this.addForm.pics)
    },
    handleSuccess(response) {
      const picInfo = {pic: response.data.tmp_path}
      this.addForm.pics.push(picInfo)
      console.log(this.addForm)
    },
    async tabClick() {
      if (this.activeIndex === '1') {
        const {data: res} = await this.$http.get(`categories/` + this.cateId + '/attributes', {
          params: {
            sel: 'many'
          }
        })
        if (res.meta.status !== 200) {
          return this.$message.error("失败")
        }
        this.manyTableData = res.data
        this.manyTableData.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
        })
        console.log(this.manyTableData)
      } else if (this.activeIndex === '2') {
        const {data: res} = await this.$http.get(`categories/` + this.cateId + '/attributes', {
          params: {
            sel: 'only'
          }
        })
        if (res.meta.status !== 200) {
          return this.$message.error("失败")
        }
        this.onlyTableData = res.data

        console.log(this.addForm.pics)
      }
    },
    beforeTab(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length < 2) {
        this.$message.error("请完整表单")
        return false
      }
    },
    parentChangeAction() {
    },
    async getCateList() {
      const {data: res} = await this.$http.get(`categories`)

      if (res.meta.status !== 200) {
        return this.$message.error("失败")
      }

      this.catelist = res.data
    },
  },
  computed: {
    cateId() {
      return this.addForm.goods_cat[this.addForm.goods_cat.length - 1]
    }
  }
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 5px 0 0;
}

.previewImg {
  width: 100%;
}
</style>