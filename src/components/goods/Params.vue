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
          <el-button @click="dialogVisible = true" type="primary" size="mini" :disabled="isBtnDisabled">添加参数</el-button>
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag closable v-for="(v,k) in scope.row.attr_vals" :key="k">
                  {{ v }}
                </el-tag>

                <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag
                </el-button>


              </template>
            </el-table-column>


            <el-table-column label="ID" type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作名称" prop="attr_name">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-share" @click="showEdit(scope.row.attr_id)">编辑</el-button>
                <el-button type="primary" icon="el-icon-share" @click="showDel(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="配置管理" name="only" @tab-click="handleChangeCate">
          <el-button @click="dialogVisible = true" type="primary" size="mini" :disabled="isBtnDisabled">添加属性</el-button>
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand"></el-table-column>
            <el-table-column label="ID" type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作名称" prop="attr_name">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-share" @click="showEdit(scope.row.attr_id)">编辑</el-button>
                <el-button type="primary" icon="el-icon-share" @click="showDel(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog
        @close="clearContent"
        :title="titleText"
        :visible.sync="dialogVisible"
        width="50%"
    >
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="80px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addInfo">确 定</el-button>
      </span>
    </el-dialog>


    <el-dialog
        @close="clearEditContent"
        title="修改"
        :visible.sync="dialogVisibleEdit"
        width="50%"
    >
      <el-form ref="addFormEditRef" :model="addEditForm" :rules="addEditFormRules" label-width="80px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addEditForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="addEditInfo">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
        @close="clearEditContent"
        title="修改"
        :visible.sync="dialogVisibleEdit"
        width="50%"
    >
      <el-form ref="addFormEditRef" :model="addEditForm" :rules="addEditFormRules" label-width="80px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addEditForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="addEditInfo">确 定</el-button>
      </span>
    </el-dialog>
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
      onlyTableData: [],
      dialogVisible: false,
      addForm: {
        'attr_name': '',
      },
      addFormRules: {
        attr_name: [{required: true, message: '请输入活动名称', trigger: 'blur'}]
      },
      dialogVisibleEdit: false,
      addEditForm: {},
      addEditFormRules: {
        attr_name: [{required: true, message: '请输入活动名称', trigger: 'blur'}]
      },
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return;
      }
      //  提交至数据库
    },
    showInput(row) {
      row.inputVisible = true
      //当页面上元素被重新渲染后，才会执行回调函数中的代码，否则可能会报错
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    async showEdit(attr_id) {
      const {data: res} = await this.$http.get('categories/' + this.cateId + '/attributes/' + attr_id, {
        params: {attr_sel: this.activeName}
      })

      if (res.meta.status !== 200) {
        return this.$message.error("失败")
      }

      this.addEditForm = res.data
      this.dialogVisibleEdit = true
      this.$message.success("成功")

    },
    async showDel(attr_id) {
      const {data: res} = await this.$http.delete('categories/' + this.cateId + '/attributes/' + attr_id)

      if (res.meta.status !== 200) {
        return this.$message.error("删除失败")
      }

      this.dialogVisibleEdit = false
      this.handleChangeCate()
      this.$message.success("删除成功")
    },
    addEditInfo() {
      this.$refs.addFormEditRef.validate(async valid => {
        if (!valid) return;
        const {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.addEditForm.attr_id}`, {
          attr_name: this.addEditForm.attr_name,
          attr_sel: this.activeName
        })

        if (res.meta.status !== 200) {
          return this.$message.error("失败")
        }

        this.$message.success("成功")
        this.dialogVisibleEdit = false
        this.handleChangeCate()

      })

    },
    addInfo() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;

        const {data: res} = await this.$http.post('categories/' + this.cateId + '/attributes', {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })

        if (res.meta.status !== 201) {
          return this.$message.error("失败")
        }

        this.$message.success("成功")
        this.dialogVisible = false
        this.handleChangeCate()

      })
    },
    clearEditContent() {
      this.$refs.addFormEditRef.resetFields()
    },
    clearContent() {
      this.$refs.addFormRef.resetFields()
    },
    //请求列表数据
    async handleChangeCate() {

      const {data: res} = await this.$http.get('categories/' + this.cateId + '/attributes', {
        params: {sel: this.activeName}
      })


      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : [];
        item.inputVisible = false;
        item.inputValue = '';
      })

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
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态参数'
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

.el-tag {
  margin: 10px;
}

.input-new-tag {
  width: 120px;
}

</style>