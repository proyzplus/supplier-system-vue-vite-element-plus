<template>
  <div class="commodSummary borderStyle">
    <div class="mainBoxHeader">
      <el-form :inline="true" class="demo-form-inline" label-width="100px" style="padding-top:24px;">
        <el-form-item label="商品查询：">
          <el-input placeholder="商品名称或条码号" v-model="key" class="input-with-select" style="width:240px;margin-left:8px;">
            <template #append>
              <el-button icon="el-icon-search" @click="currentPage=1,getData()"></el-button>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table :data="tableData" style="width: 100%" height="680">
        <el-table-column prop="commodPackcode" label="系统条码"></el-table-column>
        <el-table-column prop="name" label="商品名称"></el-table-column>
        <el-table-column label="所属分类">
          <template #default="scope">
            <p v-if="scope.row.class">{{scope.row.class.name}}</p>
          </template>
        </el-table-column>
        <el-table-column label="单位">
          <template #default="scope">
            <span v-for="(item,index) in scope.row.descriptionList" :key="index">{{item}}<span v-if="index + 1 < scope.row.descriptionList.length && scope.row.descriptionList.length > 1">/</span></span>
          </template>
        </el-table-column>
        <el-table-column label="供应价">
          <template #default="scope">
            <span v-for="(item,index) in scope.row.costList" :key="index">{{item}}<span v-if="index + 1 < scope.row.descriptionList.length && scope.row.costList.length > 1">/</span></span>
          </template>
        </el-table-column>
        <el-table-column prop="sort_index" label="排序"></el-table-column>
      </el-table>
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="getData" :current-page="currentPage" :page-sizes="[30,50,100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, toRefs, getCurrentInstance } from 'vue'
import { listCommond } from '../../api/commod';
export default {
  name: "commodSummary",
  setup() {
    const { proxy } = getCurrentInstance()
    const page_data = reactive({
      key: "",
      currentPage: 1,
      pageSize: 30,
      total: 0,
      tableData: [],
      userInfo: {}
    })
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
        main_provider_id: page_data.userInfo.id
      }
      if (page_data.key) {
        data.key = page_data.key;
      }
      listCommond(data).then(res => {
        page_data.total = res.data.count;
        let tableData = res.data.rows;
        for (let i = 0; i < tableData.length; i++) {
          if (tableData[i].bar_code[0] == "0000001") {
            // delete tableData[i];
          } else {
            tableData[i].descriptionList = [];
            tableData[i].moneyList = [];
            tableData[i].costList = [];
            tableData[i].commodPackcode = "";
            if (tableData[i].commodPack.length > 0) {
              let descriptionList = [];
              let moneyList = [];
              let costList = [];
              let commodPackcode = "";
              let commodPack = tableData[i].commodPack;
              for (let i = 1; i < commodPack.length; i++) {
                for (let j = 0; j < commodPack.length - 1; j++) {
                  let max = commodPack[j].unitFactor;
                  let nextCount = commodPack[j + 1].unitFactor;
                  if (nextCount < max) {
                    let preData = commodPack[j];
                    commodPack[j] = commodPack[j + 1];
                    commodPack[j + 1] = preData;
                  }
                }
              }
              for (let j = 0; j < commodPack.length; j++) {
                if (commodPack[j].code) {
                  commodPackcode = commodPack[j].code;
                }
                if (!commodPack[j].is_deleted) {
                  descriptionList.push(
                    commodPack[j].unit ? commodPack[j].unit.name : ""
                  );
                  moneyList.push(Number(commodPack[j].price));
                  costList.push(Number(commodPack[j].supply_price));
                }
              }
              tableData[i].descriptionList = descriptionList;
              tableData[i].moneyList = moneyList;
              tableData[i].costList = costList;
              tableData[i].commodPackcode = commodPackcode;
            }
          }
        }
        page_data.tableData = tableData;
      })
    }
    const handleSizeChange = val => {
      page_data.pageSize = val;
      getData()
    }
    return { ...toRefs(page_data), getData, handleSizeChange }
  }
}
</script>

<style lang='less' scoped>
</style>
