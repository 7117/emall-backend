<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/righs' }">权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column label="ID" type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authname"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'" type="success">一级</el-tag>
            <el-tag v-if="scope.row.level === '1'" type="warning">二级</el-tag>
            <el-tag v-if="scope.row.level === '2'" type="info">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>


</template>

<script>
export default {
  data() {
    return {
      rightsList: []
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    async getRightsList() {
      const {data: res} = await this.$http.get('rights/' + 'list')

      if(res.meta.status !== 200 ){
        return this.$message.error("权限列表获取失败")
      }

      this.rightsList = res.data

    }
  }
}
</script>

<style lang="less" scoped>

</style>