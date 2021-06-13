<template>
  <div class="warehouseHomePage borderStyle">
    <div class="warehouseHomePageHeader">
      <el-card style="cursor: pointer;" v-for="(item,index) in logisticList" :key="index">
        <div class="cardBox" @click="letUsGo(item.router_name)">
          <div class="card_header">
            <div class="card_img">
              <img :src="item.orderImg">
            </div>
            <div class="card_word">
              <p>
                <span>{{item.orderName}}</span>
                <span>{{item.orderNum>0?item.orderNum:''}}</span>
              </p>
              <p>{{item.orderStatus}}</p>
            </div>
          </div>
          <div class="bingoY"></div>
        </div>
      </el-card>
    </div>
    <div class="mainBoxHeader">
      <el-form :inline="true" class="demo-form-inline" label-width="100px" style="padding-top:24px;">
        <el-form-item label="时间查询：">
          <DatePicker :time="time" @changeTime="changeTime"></DatePicker>
        </el-form-item>
        <el-form-item label="订单查询：">
          <el-input placeholder="请输入订单号" v-model="order_id" class="input-with-select" style="width:240px;margin-left:8px;">
            <template #append>
              <el-button icon="el-icon-search" @click="currentPage=1,getData()"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="状态查询：">
          <el-radio-group v-model="status" style="margin: 8px;" @change="currentPage=1,getData()">
            <el-radio :label="null">全 部</el-radio>
            <el-radio label="waiting">待审核</el-radio>
            <el-radio label="audited">已审核</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <div class="logistics_AllStoreComod_boxTable">
      <el-table :data="tableData" style="width: 100%" height="680">
        <el-table-column prop="order_id" label="门店请货单号"></el-table-column>
        <el-table-column label="公司名称">
          <template #default="scope">
            <p>{{scope.row.user?scope.row.user.name:''}}</p>
          </template>
        </el-table-column>
        <el-table-column label="请货门店">
          <template #default="scope">
            <p style="font-weight:600;color:black;">{{scope.row.request_shop.name}}</p>
          </template>
        </el-table-column>
        <el-table-column label="配送地址">
          <template #default="scope">
            <p style="font-size:14px;line-height:20px;font-weight:bold;color:black;">{{scope.row.request_shop.area}}</p>
            <p style="font-size:12px;color:#8c8c8c;line-height:20px;">{{scope.row.request_shop.street}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="commod_count" label="商品项数" sortable></el-table-column>
        <el-table-column label="货款">
          <template #default="scope">
            <p style="font-weight:600;color:black;">￥{{Number(scope.row.total_price).toFixed(2)}}</p>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template #default="scope">
            <p>{{statusfilters(scope.row.status)}}</p>
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
import { useRouter } from 'vue-router'
import { listWarehouseExpressOrder, providerGetStatusCount } from '../../api/warehouse';
import moment from "moment";

export default {
  name: "warehouseHomePage",
  setup() {
    const { proxy } = getCurrentInstance()
    const router = useRouter()
    const page_data = reactive({
      logisticList: [
        {
          orderName: "仓储供货",
          orderStatus: "可查看仓储商品",
          orderImg: "/static/image/warehouse/logistic (1).png",
          orderNum: 0,
          router_name: "supplyWarehouse"
        },
        {
          orderName: "货品统计报",
          orderStatus: "可查看货品统计",
          orderImg: "/static/image/warehouse/logistic (1).png",
          orderNum: 0
        },
        {
          orderName: "门店请货单",
          orderStatus: "可处理门店请货单",
          orderImg: "/static/image/warehouse/logistic (1).png",
          orderNum: 0
        },
        {
          orderName: "门店配送单",
          orderStatus: "可处理跟踪配送情况",
          orderImg: "/static/image/warehouse/logistic (1).png",
          orderNum: 0
        }
      ],
      userInfo: {},
      time: [
        moment()
          .startOf("month")
          .format("YYYY-MM-DD"),
        new Date()
      ],
      begin_time: moment()
        .startOf("month")
        .format("YYYY-MM-DD"),
      end_time: moment(new Date().getTime()).format("YYYY-MM-DD"),
      order_id: null,
      status: null,
      currentPage: 1,
      tableData: [],
      total: 0,
      pageSize: 30
    })
    const letUsGo = (val) => {
      router.push({ name: val })
    }
    onMounted(() => {
      proxy.$localForage.getItem("looovoSupplier").then(res => {
        page_data.userInfo = res;
        getData()
      })
    })
    const getData = () => {
      let data = {
        order: "id desc",
        limit: page_data.pageSize,
        offset: (page_data.currentPage - 1) * page_data.pageSize,
        provider_id: page_data.userInfo.id,
        begin_time: page_data.begin_time,
        end_time: page_data.end_time
      };
      if (page_data.order_id) {
        data.order_id = page_data.order_id;
      }
      if (page_data.status) {
        data.status = page_data.status;
      }
      listWarehouseExpressOrder(data).then(res => {
        page_data.tableData = res.data.rows;
        page_data.total = res.data.count;
      })
      providerGetStatusCount().then(res => {
        page_data.logisticList[0].orderNum = res.data;
      });
    }
    const statusfilters = val => {
      switch (val) {
        case "waiting":
          return "待审核";
        case "audited":
          return "已审核";
        case "express":
          return "已取货";
        case "done":
          return "已到货";
      }
    }
    const handleSizeChange = val => {
      page_data.pageSize = val;
      getData()
    }
    const changeTime = val => {
      page_data.begin_time = moment(new Date(val[0])).format("YYYY-MM-DD");
      page_data.end_time = moment(new Date(val[1])).format("YYYY-MM-DD");
      getData();
    }
    return { ...toRefs(page_data), letUsGo, getData, statusfilters, handleSizeChange, changeTime }
  }
}
</script>

<style lang='less' scoped>
.warehouseHomePageHeader {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  .el-card {
    width: 24.5% !important;
    .card_header {
      width: 100%;
      display: flex;
    }
    .card_img {
      width: 80px;
      height: 80px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .card_word {
      p:first-child {
        span:first-child {
          width: 120px;
          height: 37px;
          font-size: 28px;
          color: #303133;
          line-height: 36px;
        }
        span:last-child {
          padding-left: 12px;
          font-size: 28px;
          font-weight: bold;
          color: #ff6900;
          line-height: 36px;
        }
      }
      p:last-child {
        height: 21px;
        font-size: 16px;
        color: #909399;
        line-height: 36px;
      }
    }
  }
}
</style>
