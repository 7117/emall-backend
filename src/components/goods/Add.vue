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


      <el-form label-position="top" :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="活动名称" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-tabs v-model="activeIndex" :tab-position="'left'" style="height: 200px;">
          <el-tab-pane label="用户管理" name="0">用户管理</el-tab-pane>
          <el-tab-pane label="配置管理" name="1">配置管理</el-tab-pane>
          <el-tab-pane label="角色管理" name="2">角色管理</el-tab-pane>
          <el-tab-pane label="定时任务" name="3">定时任务</el-tab-pane>
          <el-tab-pane label="定时任务" name="4">定时任务</el-tab-pane>
        </el-tabs>
      </el-form>

    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addFormRules: {},
      addForm: {},
      activeIndex: '0'
    }
  },
  created() {
  },
  methods: {},
  computed: {}
}
</script>

<style lang="less" scoped>

</style>