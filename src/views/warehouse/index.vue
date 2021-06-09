<template>
  <div class="warehouseHomePage borderStyle">
    <div class="warehouseHomePageHeader">
      <el-card style="border:0px;" v-for="(item,index) in logisticList" :key="index">
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
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
export default {
  setup() {
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
      ]
    })
    const letUsGo = (val) => {
      router.push({ name: val })
    }
    return { ...toRefs(page_data), letUsGo }
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
