<!--
 * @Description: 日期组件
 * @Version: 1.0
 * @Autor: zero
 * @Date: 2020-08-17 16:15:21
 * @LastEditors: zero
 * @LastEditTime: 2020-08-18 10:24:41
--> 
<template>
  <section>
    <el-date-picker v-model="time" @change='changeTime' unlink-panels type="daterange" style="width: 100%;max-width:250px;" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :shortcuts="shortcuts">
    </el-date-picker>
  </section>
</template>
<script>
import moment from "moment";
import { reactive, getCurrentInstance, toRefs } from 'vue';
export default {
  name: "dataPicker",
  props: ['time'],
  setup() {
    const { emit } = getCurrentInstance();
    const page_data = reactive({
      shortcuts: [
        {
          text: '最近一周',
          value: (() => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            return [start, end]
          })(),
        },
        {
          text: '最近一个月',
          value: (() => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            return [start, end]
          })(),
        },
        {
          text: '最近三个月',
          value: (() => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            return [start, end]
          })(),
        }
      ]
    })
    const changeTime = (val) => {
      emit('changeTime', val)
    }
    return { ...toRefs(page_data), changeTime }
  }
};
</script>
