<template>
  <div class="scrollbar">
    <div class="menu">
      <img src="../../static/image/logo.png" style="width:160px;">
    </div>
    <div class="topListTab">
      <div :class="index==selectIndex?'scrollbar_list selectTrue':'scrollbar_list selectFaler'" v-for="(item,index) in scrollbarList" :key="index" @click="scrollTab(item.routerPath,index)">
        <p>
          <img :src="item.newIcon">
          <span>{{item.scrollWord}}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue';
import { useRouter } from 'vue-router'
export default {
  setup() {
    const router = useRouter();
    const page_data = reactive({
      scrollbarList: [{
        id: 1,
        power_id: 1001,
        newIcon: "/static/image/warehouse/logistics_click.png",
        scrollWord: "供货管理",
        routerPath: "/warehouse/homePage",
      },
      {
        id: 2,
        power_id: 1002,
        newIcon: "/static/image/warehouse/commod_click.png",
        scrollWord: "商品管理",
        routerPath: "/commod/commodityManager",
      },
      {
        id: 3,
        power_id: 1003,
        newIcon: "/static/image/warehouse/finance_click.png",
        scrollWord: "财务管理",
        routerPath: "/finance/supplierReconciliation",
      }],
      selectIndex: 0,
    })
    const scrollTab = (val, index) => {
      page_data.selectIndex = index
      router.push({ path: val })
    }
    return { ...toRefs(page_data), scrollTab }
  }
}
</script>

<style lang="less" scoped>
.topListTab {
  width: 160px;
  // height: calc(100vh - 100px);
  height: 90%;
  min-height: 380px;
  overflow: auto;
  // padding-right: 28px;
}
.lastLabel {
  width: 160px;
  height: 72px;
  position: fixed;
  bottom: 0px;
}
.selectTrue {
  background: linear-gradient(270deg, #feab38 0%, #ff6900 100%);
  p {
    color: #343643 !important;
  }
}
.selectFaler {
  background-color: #fff;
  p {
    color: #343643 !important;
  }
}
.scrollbar_list:hover {
  background: linear-gradient(270deg, #feab38 0%, #ff6900 100%);
  cursor: pointer;
}
.scrollbar {
  width: 160px;
  height: 100%;
  .scrollbar_list {
    width: 160px;
    height: 72px;
    border-bottom: 1px solid #f1f1f1;
    img {
      width: 32px;
      height: 32px;
      padding-top: 12px;
    }
    p {
      width: 160px;
      text-align: center;
      color: #fff;
      font-size: 12px;
      line-height: 24px;
    }
  }
}
</style>
