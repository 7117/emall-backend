<template>
  <div>

    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!--      按钮-->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!--      表格-->
      <tree-table
          class="treeTable"
          :data="catelist "
          :columns="columns"
          show-index
          border
          index-text="ID"
          :selection-type="false"
          :expand-type="false"
      >
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" style="color: lightgreen;" v-if="scope.row.cat_deleted === false"></i>
          <i class="el-icon-error" style="color: #2b4b6b;" v-if="scope.row.cat_deleted === true"></i>
        </template>

        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level===0" size="mini" type="primary">一</el-tag>
          <el-tag v-if="scope.row.cat_level===1" size="mini" type="warning">二</el-tag>
          <el-tag v-if="scope.row.cat_level===2" size="mini" type="info">三</el-tag>
        </template>

        <template slot="opt" slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
          <el-button type="warning" size="mini" icon="el-icon-edit">删除</el-button>
        </template>

      </tree-table>
      <!--      分页-->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>

    </el-card>

    <el-dialog
        title="添加分类"
        :visible.sync="dialogVisibleCat"
        width="50%"
    >

      <el-form ref="catForm" label-width="80px" :rules="catFormRules">
        <el-form-item label="活动名称" prop="cat_name">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-input></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleCat = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisibleCat = false">确 定</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
export default {
  data() {
    return {
      catForm: {
        cat_name: '',
        cat_pid:0,
        cat_level:0,
      },
      catFormRules: {
        cat_name: [
          {required: true, message: '请输入活动名称', trigger: 'blur'},
          {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
        ]
      },
      dialogVisibleCat: false,
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      catelist: [],
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        },
      ],
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    showDialog() {
      this.dialogVisibleCat = true
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    async getCateList() {
      const {data: res} = await this.$http.get('categories', {params: this.queryInfo})

      if (res.meta.status !== 200) {
        return this.$message.error("获取失败")
      }

      this.catelist = res.data.result
      this.total = res.data.total
    },
  }
}
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
</style>