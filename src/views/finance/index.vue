<template>
  <div class="financeSummary borderStyle">
    <div class="mainBoxHeader">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="100px" style="padding-top:24px;">
        <el-form-item label="日期查询：">
          <DatePicker :time="time" @changeTime="changeTime"></DatePicker>
        </el-form-item>
        <el-form-item label="订单类型：">
          <el-select style="width:248px;" v-model="formInline.type" @change="getData">
            <el-option label="所有单据类型" :value="0"></el-option>
            <el-option label="门店直配单" value="directOrder"></el-option>
            <el-option label="供应商退货单" value="providerReturnOrder"></el-option>
            <el-option label="采购单" value="procurementOrder"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="结算类型：">
          <el-select style="width:248px;" v-model="formInline.settle_status" @change="getData">
            <el-option label="所有结算类型" :value="0"></el-option>
            <el-option label="全部待结算" :value="1"></el-option>
            <el-option label="全部已结算" :value="2"></el-option>
            <el-option label="仅部分结算" :value="3"></el-option>
            <el-option label="作废" :value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="导出报表：">
          <!-- <export-files buttonName="导出供应商对账" :column="column" :tableData="DownloadTableData" :DownloadListAll="DownloadListAll" name="供应商对账表.xlsx'"></export-files> -->
        </el-form-item>
      </el-form>
      <el-form :inline="true" class="demo-form-inline" label-width="100px">
        <el-form-item label="单号查询：">
          <el-input style="width:248px;" v-model="order_id" placeholder="单号">
            <template #append>
              <el-button icon="el-icon-search" @click="getData"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="对账状态：">
          <el-select style="width:248px;" v-model="confirm_status" @change="getData">
            <el-option label="所有确认状态" :value="0"></el-option>
            <el-option label="未确认" :value="1"></el-option>
            <el-option label="公司确认" :value="2"></el-option>
            <el-option label="对账完成" :value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="financeTable">
      <el-table :data="tableData" style="width: 100%" height="680">
        <el-table-column prop="order_id" label="单号"></el-table-column>
        <el-table-column prop="provider_code" label="供应商编号"></el-table-column>
        <el-table-column prop="provider_user_name" label="供应商名称"></el-table-column>
        <el-table-column label="单据类型">
          <template #default="scope">
            <p v-if="scope.row.type == 'procurementOrder'">采购单</p>
            <p v-if="scope.row.type == 'providerReturnOrder'">退货单</p>
            <p v-if="scope.row.type == 'directOrder'">门店直配单</p>
          </template>
        </el-table-column>
        <el-table-column label="结算状态">
          <template #default="scope">
            <p style="color:#ff6900;" v-if="Number(scope.row.settle_status) == 1">全部待结算</p>
            <p style="color:green;" v-if="Number(scope.row.settle_status) == 2">全部已结算</p>
            <p style="color:#44D7B6;" v-if="Number(scope.row.settle_status) == 3">仅部分结算</p>
          </template>
        </el-table-column>
        <el-table-column prop="should_pay_account" label="金额"></el-table-column>
        <el-table-column label="应收应付">
          <template #default="scope">
            <p v-if="scope.row.received_pay == 'pay'">应收</p>
            <p v-else>应付</p>
          </template>
        </el-table-column>
        <el-table-column prop="company_confirm_time" label="总部确认时间"></el-table-column>
        <el-table-column prop="remark" label="总部备注"></el-table-column>
        <el-table-column prop="provider_confirm_time" label="供应商确认时间"></el-table-column>
        <el-table-column prop="provider_remark" label="供应商备注"></el-table-column>
        <el-table-column prop="createby" label="单据日期"></el-table-column>
        <el-table-column label="确认状态">
          <template #default="scope">
            <p style="color:#FF0000;" v-if="scope.row.confirm_status==1">双方未确认</p>
            <p style="color:#ff6900" v-if="scope.row.confirm_status==2">公司已确认</p>
            <p style="color:#ff6900;" v-if="scope.row.confirm_status==3">供应商已确认</p>
            <p style="color:green;" v-if="scope.row.confirm_status==4">对账完成</p>
          </template>
        </el-table-column>

      </el-table>
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="getData" :current-page="currentPage" :page-sizes="[30,50,100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted, getCurrentInstance } from 'vue'
import { providerCurrentAccountList } from '../../api/finance';
import moment from "moment";

export default {
  name: "financeSummary",
  setup() {
    const { proxy } = getCurrentInstance()
    const page_data = reactive({
      time: [
        moment()
          .startOf("month")
          .format("YYYY-MM-DD"),
        new Date()
      ],
      begin_time: "",
      end_time: "",
      formInline: {
        type: 0,
        settle_status: 0,
      },
      order_id: "",
      confirm_status: 0,
      userInfo: {},
      pageSize: 30,
      currentPage: 1,
      total: 0,
      tableData: [],
    })
    onMounted(() => {
      proxy.$localForage.getItem("looovoSupplier").then(res => {
        page_data.userInfo = res;
        getData()
      })
    })
    const getData = () => {
      let data = {
        limit: page_data.pageSize,
        offset: (page_data.currentPage - 1) * page_data.pageSize,
        order: "id desc",
        provider_id: page_data.userInfo.id
      }
      providerCurrentAccountList(data).then(res => {
        if (res.code == 200) {
          page_data.tableData = res.data.rows;
          page_data.total = res.data.count;
        }
      })
    }
    const changeTime = val => {
      page_data.begin_time = moment(new Date(val[0])).format("YYYY-MM-DD");
      page_data.end_time = moment(new Date(val[1])).format("YYYY-MM-DD");
      getData();
    }
    const handleSizeChange = val => {
      page_data.pageSize = val;
      getData()
    }
    const filterType = val => {

    }
    return { ...toRefs(page_data), getData, changeTime, handleSizeChange, filterType }
  }
}
</script>

<style lang='less' scoped>
</style>
