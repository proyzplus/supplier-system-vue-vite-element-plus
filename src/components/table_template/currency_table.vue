<template>
  <div class="currency_table_currency_table">
    <div>
      <el-table ref="table" @selection-change="handleSelectionChange" :row-key="getRowKeys" :row-style="rowStyle" :sumto="sumto" :data="after_tableData" v-loading="$store.state.user.isLoading" @select="handleselectchecked" @select-all="handlecheckAll" @sort-change="changeTableSort" header-row-class-name="tableHead">
        <!-- :stripe='stripe' -->
        <el-table-column v-if="selection" type="selection" :reserve-selection="true" :selectable="selectable" :align="align" width="55"></el-table-column>
        <el-table-column v-if="index" type="index" :align="align" width="50"></el-table-column>
        <template v-for="(item) of column">
          <!--分支模式-->
          <el-table-column v-if="item.isBranch" :sortable="item.sortable" :prop="item.prop" :label="item.label" :width="item.width" :align="align" :key="item.label" :show-overflow-tooltip="true">
            <template #default="scope">
              <span v-for="(item2, index2) of item[item.prop]" :key="index2">
                <span v-if="String(scope.row[item.prop]) === String(item2.id)">{{ item2.title }}</span>
              </span>
            </template>
          </el-table-column>
          <!-- 可以编辑头部同时自定义表格内容 -->
          <el-table-column v-else-if="item.isScope && item.isIconShop" :render-header="(h, params) => renderHeader(h, params, item)" :prop="item.prop" :label="item.label" :width="item.width" :align="align" :key="item.label" :show-overflow-tooltip="true">
            <template #default="scope">
              <slot :name="item.prop" :data="scope" v-if="scope.row.is_own == true || scope.row.is_own == undefined"></slot>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <!--编辑模式 二-->
          <el-table-column v-else-if="item.isInput" :sortable="item.sortable" :prop="item.prop" :label="item.label" :align="align" :width="item.width" :key="item.label" :show-overflow-tooltip="true" :isInputType="item.isInputType">
            <template #default="scope">
              <!-- 正整数 -->
              <el-input v-if="item.isInputType == Number" suffix-icon="el-icon-edit" size="small" v-model="scope.row[item.prop]" style="width: 150px" onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" placeholder="请输入" @blur="inputBlurChange(scope, item.prop, item.prop + '_' + scope.$index)"></el-input>
              <!-- 价格 -->
              <el-input v-else-if="item.isInputType == 'Price'" step="0.01" size="small" v-model="scope.row[item.prop]" style="width: 150px" placeholder="请输入" @blur="inputBlurChange(scope, item.prop, item.prop + '_' + scope.$index)"></el-input>
              <!-- 字符串 -->
              <el-input v-else-if="item.isInputType == String" suffix-icon="el-icon-edit" size="small" v-model="scope.row[item.prop]" style="width: 150px" placeholder="请输入" @blur="inputBlurChange(scope, item.prop, item.prop + '_' + scope.$index)"></el-input>
              <!-- 日期 -->
              <el-date-picker v-else-if="item.isInputType == Date" v-model="scope.row[item.prop]" type="date" placeholder="请选择生产日期" style="width: 150px" size="small" @change="inputBlurChange(scope, item.prop, item.prop + '_' + scope.$index)" value-format="yyyy-MM-dd" :picker-options="pickerOptions"></el-date-picker>
              <!-- 下拉框 -->
              <el-select v-else-if="item.isInputType == Object" v-model="scope.row.selectUnitName_id" size="small" style="width: 120px" placeholder="请选择" @change="inputBlurChange(scope, item.prop, item.prop + '_' + scope.$index)">
                <el-option v-for="item in scope.row.selectTotalData" :key="item.id" :label="item.name ? item.name : item.unit.name" :value="item.id"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <!--局部模式   is_own 是用来判断该商品是商户自己创建的还是代理过来的，他只能修改自己的商品-->
          <el-table-column v-else-if="item.isScope" :sortable="item.sortable" :prop="item.prop" :label="item.label" :width="item.width" :align="align" :key="item.label" :show-overflow-tooltip="true">
            <template :name="item.prop" :data="scope" #default="scope">
              <p v-if="scope.row.is_own == true || scope.row.is_own == undefined">
                <slot></slot>
              </p>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <!--展数值开模式-->
          <!--仅当该字段为数组的时候可用-->
          <el-table-column v-else-if="item.isSpread && !item.isEdit" :prop="item.prop" :label="item.label" :align="align" :width="item.width" :key="item.label" :show-overflow-tooltip="true">
            <template #default="scope">
              <span v-if="Object.prototype.toString.call(scope.row[item.prop]).includes('Array')">{{ scope.row[item.prop].join("/") }}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <!--icon模式-->
          <el-table-column :render-header="(h, params) => renderHeader(h, params, item)" v-else-if="item.isIconShop" :sortable="item.sortable" :prop="item.prop" :label="item.label" :width="item.width" :align="align" :key="item.label" :show-overflow-tooltip="true">
            <template #default="scope">
              <p style="font-size: 14px">{{ scope.row[item.prop] }}</p>
            </template>
          </el-table-column>
          <!-- 数字模式 -->
          <el-table-column v-else-if="item.isNumber" :sortable="item.sortable" :prop="item.prop" :label="item.label" :align="align" :width="item.width" :key="item.label" :show-overflow-tooltip="true">
            <template #default="scope">
              <p>{{ typeof scope.row[item.prop] == "number" ? scope.row[item.prop].toFixed(2) : scope.row[item.prop] }}</p>
            </template>
          </el-table-column>
          <!--普通模式-->
          <el-table-column v-else :sortable="item.sortable" :prop="item.prop" :label="item.label" :align="align" :width="item.width" :key="item.label" :show-overflow-tooltip="true"></el-table-column>
        </template>
        <!-- operation:操作列是否显示  可控制操作栏的宽度 -->
        <el-table-column :width="operation_width" :align="align" v-if="operation" :label="label" :show-overflow-tooltip="true">
          <template #default="scope">
            <slot :data="scope"></slot>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination" v-if="total">
        <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" v-model:currentPage="currentPage2" :page-sizes="pageSizes || [pageSize2]" :page-size="pageSize2" layout="sizes, prev,pager,next,total,jumper" :total="Number(total)"></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, computed, getCurrentInstance } from 'vue'
export default {
  name: "currency_table",
  props: [
    "sumto",
    "isLoading",
    "column",
    "operation",
    "tableData",
    "total",
    "handleCurrentChange",
    "pageSize",
    "pageSizes",
    "currentPage",
    "selection",
    "time_mark",
    "time_type",
    "operation_width",
    "multipleSelection",
    "index",
    "updateURL",
    "selectData",
    "cacheIds",
    "selectable",
    "rowStyle",
    "align",
    "stripe",
    "label"
  ],
  setup(props, context) {
    const { proxy } = getCurrentInstance()
    const data = reactive({
      convertTimeList: [
        "max_createby",
        "sheif_end_date",
        "createdAt",
        "createby",
        "updateby",
        "start_time",
        "end_time",
        "end_date",
        "start_date",
        "order_time",
        "add_time",
        "start_work",
        "end_work",
        "begin_time",
        "last_production_date",
        "last_sheif_end_date"
      ],
      currentPage2: proxy.currentPage,
      pageSize2: proxy.pageSize || 10,
      multipleSelection2: [],
      popoverList: {},
      popoverEditValue: "",
      getRowKeys(row) {
        return row.id;
      }
    })
    const after_tableData = computed(() => {
      const data = [];
      for (let i of proxy.tableData) {
        proxy.convertTimeList.forEach(
          value =>
            i[value] ? (i[value] = convertTime(i[value])) : i[value]
        );
        data.push(i);
      }
      if (proxy.cacheIds && proxy.cacheIds.length !== 0) {
        proxy.$nextTick(() => {
          for (let i of data) {
            if (proxy.cacheIds.includes(i.id)) {
              proxy.$refs.table.toggleRowSelection(i, true);
            }
          }
        });
      }
      return data;
    })
    function convertTime(timeString) {
      const time_mark = proxy.time_mark || "-";
      const date = new Date(Date.parse(timeString));
      const getFullYear = date.getFullYear();
      const getMonth =
        date.getMonth() + 1 < 10
          ? `0${date.getMonth() + 1}`
          : date.getMonth() + 1;
      const getDate =
        date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
      if (proxy.time_type && proxy.time_type === "short") {
        return `${getFullYear}${time_mark}${getMonth}${time_mark}${getDate}`;
      } else {
        return `${getFullYear}${time_mark}${getMonth}${time_mark}${getDate} ${date.toLocaleTimeString(
          "it-IT"
        )}`;
      }
    }
    const handleSizeChange = (val) => {
      data.pageSize2 = val;
    }
    const renderHeader = (h, { column, $index }, item) => {
      return h(
        "div",
        {
          style: "line-height:30px;"
        },
        [
          h("i", {
            class: item.iconClass,
            style: item.iconStyle
          }),
          h("span", column.label),
          h(
            "p",
            {
              style:
                "position:absolute;top:0px;left:10px;width:100%;text-align:left;line-height:20px;color:#909399;font-size:14px"
            },
            item.total
          )
        ]
      );
    }
    const changeTableSort = (column, prop, order) => {
      context.$emit("changeCountColumn", column);
    }
    const inputBlurChange = (scope, prop, index, mode) => {
      context.$emit("changeCount", scope, mode);
    }
    const handleSelectionChange = (val) => {
      data.multipleSelection2 = val;
    }
    const handleselectchecked = (val, row) => {
      context.$emit("updateChange", row);
    }
    const handlecheckAll = (val) => {
      context.$emit("updateChangeAll", val);
    }
    return {
      ...toRefs(data), after_tableData, handleSizeChange, renderHeader,
      changeTableSort, inputBlurChange, handleSelectionChange, handleselectchecked,
      handlecheckAll
    }
  }
};
</script>

<style lang="less" scoped>
.currency_table_currency_table {
  width: 100%;
  overflow: auto;
  margin-bottom: 32px;
  max-height: 950px;
  .pagination {
    margin-top: 1rem;
  }
}
.checkboxStyle {
  width: 284px;
  padding: 6px;
  display: flex;
  justify-content: space-between;
}
// 镂空按钮
.mybutton {
  color: #ff6900;
  background: #fff;
  border-color: #ff6900;
}
// 镂空按钮hover色
.mybutton:hover {
  color: #fff;
  background: #ff6900;
  border-color: #ff6900;
}
// 按钮色
.my-button {
  color: #fff;
  background: #ff6900;
  border: 1px solid #ff6900;
}
</style>
