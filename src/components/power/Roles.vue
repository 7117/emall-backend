<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/roles' }">角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <el-table :data="rolelist" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['dbbottom',i1===0 ? 'dbtop':'']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
              <el-col :span="5">
                <el-tag @close="removeRightById(scope.row,item1.id)" closable>{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row :class="[i2 ===0 ?'':'dbtop']" v-for="(item2,i2) in item1.children " :key="item2.id">
                  <el-col :span="6">
                    <el-tag @close="removeRightById(scope.row,item2.id)" closable type="warning">
                      {{
                        item2.authName
                      }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag @close="removeRightById(scope.row,item3.id)" closable type="info"
                            v-for="(item3,i3) in item2.children" :key="item3.id">
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="ID" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-search" size="mini" @click="editDialogVisibleInRoles(scope)">
              编辑
            </el-button>
            <el-button type="warning" icon="el-icon-search" size="mini">删除</el-button>
            <el-button @click="showSetRightDialog(scope.row)" type="info" icon="el-icon-search" size="mini">权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 编辑按钮的弹出框   -->
    <el-dialog
        title="修改权限"
        :visible.sync="editDialogVisibleInRolesView"
        width="30%"
    >
      <el-form ref="form" label-width="80px">
        <el-form-item label="活动名称">
          <el-input></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisibleInRolesView = false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </span>
    </el-dialog>

    <!--  权限树的显示-->
    <el-dialog @close="setRightDialogClosed" title="分配权限" :visible.sync="setRightVisibaleDialog" width="50%">

      <el-tree :data="rightslist"
               :props="treeProps"
               node-key="id"
               default-expand-all
               ref="treeRef"
               :default-checked-keys="defKeys"
               show-checkbox></el-tree>

      <div slot="footer" class="dialog-footer">
        <el-button @click="setRightVisibaleDialog = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      rolelist: [],
      editDialogVisibleInRolesView: false,
      setRightVisibaleDialog: false,
      rightslist: [],
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      defKeys: [],
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getHalfCheckedKeys(),
        ...this.$refs.treeRef.getCheckedKeys()
      ]
      const idStr = keys.join(',');

      const {data: res} = await this.$http.post(`roles/${this.roleId}/rights`, {
        rids: idStr
      })

      if (res.meta.status !== 200) {
        return this.$message.error("更新失败")
      } else {
        this.setRightVisibaleDialog = false
        this.getRolesList()
        return this.$message.success("更新成功")
      }
    },
    setRightDialogClosed() {
      this.defKeys = []
    },
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    async showSetRightDialog(role) {
      this.roleId = role.id

      const {data: res} = await this.$http.get('rights/tree')

      if (res.meta.status !== 200) {
        return this.$message.error('获取失败')
      }

      this.rightslist = res.data

      this.getLeafKeys(role, this.defKeys)

      this.setRightVisibaleDialog = true
    },
    async getRolesList() {
      const {data: res} = await this.$http.get('roles')

      if (res.meta.status !== 200) {
        return this.$message.error("失败");
      }

      this.rolelist = res.data

    },
    editDialogVisibleInRoles() {
      this.editDialogVisibleInRolesView = true
    },
    async removeRightById(role, rightId) {

      await this.$confirm('永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {

        const {data: res} = await this.$http.delete('roles/' + role.id + '/rights/' + rightId);

        if (res.meta.status !== 200) {
          this.$message({
            type: 'info',
            message: '删除失败'
          });
        }

        role.children = res.data

        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    }
  }

}
</script>

<style lang="less" scoped>
.el-row {
  display: flex;
  align-items: center;
}

.el-tag {
  margin: 7px;
}

.dbtop {
  border-top: 1px solid #eee;
}

.dbbottom {
  border-bottom: 1px solid #eee;
}
</style>