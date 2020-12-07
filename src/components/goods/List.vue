<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="4">
          <el-input clearable @clear="getGoodsList" v-model="queryInfo.query" placeholder="请输入内容"
                    class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>

      <el-table :data="goodslist" border stripe>
        <el-table-column label="ID" type="index"></el-table-column>
        <el-table-column label="名称" prop='goods_name'></el-table-column>
        <el-table-column label="价格" prop='goods_price' width="90px"></el-table-column>
        <el-table-column label="重量" prop='goods_weight' width="90px"></el-table-column>
        <el-table-column label="时间" prop='add_time' width="160px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button type="primary" icon="el-icon-share" @click="removeId(scope.row.goods_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[2, 5, 10, 400]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
      >
      </el-pagination>

    </el-card>

  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      goodslist: [],
      total: 0
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    addGoods() {
      this.$router.push('/goods/add')
    },
    removeId(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {

        const {data: res} = await this.$http.delete('goods/' + id)

        if (res.meta.status !== 200) {
          return this.$message.error("删除失败")
        }

        this.$message({
          type: 'success',
          message: '删除成功!'
        });

        this.getGoodsList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()

    },
    async getGoodsList() {
      const {data: res} = await this.$http.get(`goods`, {params: this.queryInfo})

      if (res.meta.status !== 200) {
        return this.$message.error("获取失败")
      }

      this.goodslist = res.data.goods
      this.total = res.data.total


      this.$message.success("获取成功")
    }
  }
}
</script>