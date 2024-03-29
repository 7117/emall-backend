<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/welcome' }">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <el-col :span="9">
          <el-input
              placeholder="请输入内容"
              v-model="queryInfo.query"
              :clearable="true"
              @clear="getUserList()"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 列表区表格区域 -->
      <el-table :data="userlist" border stripe>
        <el-table-column label="ID" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <!-- 插槽 -->
          <template slot-scope="scope">
            <el-switch
                v-model="scope.row.mg_state"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="userStateChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip
                class="item"
                effect="dark"
                content="编辑"
                placement="top-start"
                :enterable="false"
            >
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope)"></el-button>
            </el-tooltip>
            <el-tooltip
                class="item"
                effect="dark"
                content="删除"
                placement="top-start"
                :enterable="false"
            >
              <el-button type="danger" icon="el-icon-delete" size="mini"
                         @click="removeUserById(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip
                class="item"
                effect="dark"
                content="角色"
                placement="top-start"
                :enterable="false"
            >
              <el-button
                  @click="setRole(scope.row)"
                  type="warning"
                  icon="el-icon-setting"
                  size="mini">
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="queryInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total,sizes, prev, pager, next,jumper"
          :total="total"
      ></el-pagination>
    </el-card>

    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- model双向数据绑定 -->
      <!-- rules验证规则 -->
      <!-- ref表单的引用名称 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <!-- prop验证规则 -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="号码" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed"
    >
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="80px">
        <el-form-item label="活动名称">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
        title="分配角色"
        :visible.sync="setRoleDialogVisiable"
        width="50%"
        @close="setNull"
    >
      <div>
        <p>当前的用户：{{ userInfo.username }}</p>
        <p>当前的角色：{{ userInfo.role_name }}</p>
        <p>分配新角色：
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
                v-for="item in rolesList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisiable = false" >取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    // 验证邮箱
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-z0-9\+_\-]+)(\.[a-z0-9\+_\-]+)*@([a-z0-9\-]+)\.[a-z]{2,6}$/;

      if (regEmail.test(value)) {
        return cb();
      }

      cb(new Error("请输入合法的邮箱"));
    };
    // 验证手机号
    var checkMobile = (rule, value, cb) => {
      const regEmail = /^1[34578]\d{9}$/;

      if (regEmail.test(value)) {
        return cb();
      }

      cb(new Error("请输入合法的号码"));
    };

    return {
      selectedRoleId: '',
      rolesList: [],
      userInfo: {},
      setRoleDialogVisiable: false,
      //修改区域的弹出框控制开关
      editDialogVisible: false,
      editForm: {},
      // 获取用户列表的数据对象
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      userlist: [],
      total: 0,
      addDialogVisible: false,
      addForm: {
        username: "",
        email: "",
        password: "",
        mobile: ""
      },
      addFormRules: {
        username: [
          {required: true, message: "请输入邮箱", trigger: "blur"},
          {min: 0, max: 20, message: "大小不合适", trigger: "blur"}
        ],
        password: [
          {required: true, message: "请输入密码", trigger: "blur"},
          {min: 0, max: 20, message: "大小不合适", trigger: "blur"}
        ],
        email: [
          {required: true, message: "请输入邮箱", trigger: "blur"},
          {min: 0, max: 20, message: "大小不合适", trigger: "blur"},
          {validator: checkEmail, trigger: "blur"}
        ],
        mobile: [
          {required: true, message: "请输入号码", trigger: "blur"},
          {validator: checkMobile, trigger: "blur"}
        ]
      },
      editFormRules: {
        username: [
          {required: true, message: "请输入邮箱", trigger: "blur"},
          {min: 0, max: 20, message: "大小不合适", trigger: "blur"}
        ],
        email: [
          {required: true, message: "请输入邮箱", trigger: "blur"},
          {min: 0, max: 20, message: "大小不合适", trigger: "blur"},
          {validator: checkEmail, trigger: "blur"}
        ],
        mobile: [
          {required: true, message: "请输入号码", trigger: "blur"},
          {validator: checkMobile, trigger: "blur"}
        ]
      }
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    setNull() {
      this.selectedRoleId = '';
      this.userInfo = {}

    },
    async saveRoleInfo() {
      if (!this.selectedRoleId) {
        return this.$message.error("选择新的哈")
      }

      const {data: res} = await this.$http.put(`users/${this.userInfo.id}/role`, {
        rid: this.selectedRoleId
      })

      if (res.meta.status !== 200) {
        return this.$http.error("更新失败")
      } else {
        this.getUserList()
        this.setRoleDialogVisiable = false
        return this.$message.success("更新成功")
      }

    },
    async setRole(userInfo) {
      console.log(userInfo)
      this.userInfo = userInfo

      const {data: res} = await this.$http.get('roles')

      if (res.meta.status !== 200) {
        return this.$message.error("失败")
      }

      this.rolesList = res.data

      this.setRoleDialogVisiable = true
    },
    async getUserList() {
      const {data: res} = await this.$http.get("users", {
        params: this.queryInfo
      });

      if (res.meta.status !== 200) {
        return this.$message.error("获取用户失败");
      }
      this.userlist = res.data.users;
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    async userStateChange(userinfo) {
      const {data: res} = await this.$http.put(
          `users/${userinfo.id}/state/${userinfo.mg_state}`
      );

      if (res.meta.status != 200) {
        userinfo.mg_state = !userinfo.mg_state;
        return this.$message.error("更新失败");
      }
      this.$message.success("更新成功");
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    editUserInfo() {
      this.$refs.editFormRef.validate(
          async valid => {
            if (!valid) {
              return;
            }
            var {data: res} = await this.$http.put('users/' + this.editForm.id, {
                  email: this.editForm.email,
                  mobile: this.editForm.mobile
                }
            )

            if (res.meta.status !== 200) {
              return this.$message.error("更新失败")
            }

            this.editDialogVisible = false
            this.getUserList()
            this.$message.success("更新成功")
          }
      );
    },
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return;
        }
        // 网络请求
        const {data: res} = await this.$http.post("users", this.addForm);

        if (res.meta.status !== 201) {
          this.$message.error("更新失败");
        }

        this.$message.success("更新成功");

        this.addDialogVisible = false;
        this.getUserList();
      });
    },
    async showEditDialog(scope) {
      const {data: res} = await this.$http.get('users/' + scope.row.id)

      if (res.meta.status !== 200) {
        return this.$message.error("查询失败")
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },

    removeUserById(id) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const {data: res} = await this.$http.delete("users/" + id);

        if (res.meta.status !== 200) {
          this.$message({
            type: 'fail',
            message: '删除失败!'
          });
        } else {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }

        this.getUserList()

      }).catch((err) => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
        return err;
      });
    }

  }
};
</script>


<style lang="less" scoped>
</style>