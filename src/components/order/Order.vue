<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input clearable placeholder="请输入内容" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <el-table :data="orderList" border stripe>
        <el-table-column label="ID" type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{ scope.row.create_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="showBox" type="primary" size="mini" icon="el-icon-edit"></el-button>
            <el-button type="success"
                       @click="showDetail"
                       size="mini" icon="el-icon-share"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[2, 5, 10, 20]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>

    <el-dialog
        @close="addressClose"
        title="提示"
        :visible.sync="dialogVisible"
        width="50%"
    >
      <el-form
          :model="addressForm"
          :rules="addressFormRules"
          ref="addressFormRef"
          label-width="100px"
          class="demo-ruleForm">
        <el-form-item label="省市区县" prop="address1">
          <!--          v-model是选中数据的-->
          <!--          options是数据源-->
          <!--          props：checkStrictly是否只能选中最末尾的元素-->
          <!--          props：expandTrigger展开触发方式-->
          <!--          props：value选中的值-->
          <!--          props：label显示的值-->
          <!--          props：children子代元素-->
          <el-cascader
              v-model="addressForm.address1"
              :options="cityData"
              clearable
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
        title="物流提示"
        :visible.sync="processVisible"
        width="50%"
    >
      <el-timeline>
        <el-timeline-item
            v-for="(activity, index) in processInfo"
            :key="index"
            :timestamp="activity.time">
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from "@/components/order/citydata";
import kuaiData from "@/components/order/kuaidi";

export default {
  data() {
    return {
      processInfo: {},
      processVisible: false,
      addressForm: {
        address1: [],
        address2: '',
      },
      addressFormRules: {
        address1: [{required: true, message: '请输入活动名称', trigger: 'blur'},],
        address2: [{required: true, message: '请输入活动名称', trigger: 'blur'},],
      },
      dialogVisible: false,
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      total: 0,
      orderList: [],
      cityData: cityData,
      kuaiData: kuaiData,
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    showDetail() {

      if (this.kuaiData[0].meta.status !== 200) {
        return this.$message.error("失败了")
      }

      this.processInfo = this.kuaiData[0].data
      this.$message.success("成功了")
      this.processVisible = true
    },
    addressClose() {
      this.$refs.addressFormRef.resetFields()
    },
    showBox() {
      this.dialogVisible = true
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    async getOrderList() {
      const {data: res} = await this.$http.get(`orders`, {
        params: this.queryInfo
      })

      if (res.meta.status !== 200) {
        return this.$message.error("获取失败")
      }
      this.total = res.data.total
      this.orderList = res.data.goods
    },
  }
}
</script>

<style lang="less" scoped>
@import "../../plugins/timeline/timeline.css";
@import "../../plugins/timeline-item/timeline-item(1).css";
.el-cascader {
  width: 100%;
}
</style>