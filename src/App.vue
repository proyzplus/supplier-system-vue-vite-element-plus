<!--
 * @Author: proyzplus
 * @Date: 2021-06-08 16:31:54
 * @LastEditors: proyzplus
 * @LastEditTime: 2021-06-08 16:35:01
 * @Description: Description
-->
<template>
  <div id="view">
    <el-container v-if="!route_exclude.includes($route.name)" style="width:100%;height:100%;">
      <el-aside style="width:160px;height:auto;background-color:#fff;">
        <navigation class="navigation"></navigation>
      </el-aside>
      <el-container>
        <el-header>
          <topHeader class="topHeader"></topHeader>
        </el-header>
        <el-main class="main">
          <div class="main_padding">
            <router-view></router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>
    <el-container style="height:100%;" v-else>
      <router-view></router-view>
    </el-container>
  </div>
</template>

<script> 
import { reactive, toRefs, getCurrentInstance, watchEffect } from 'vue'
import navigation from './layout/navigation.vue';
import topHeader from './layout/topHeader.vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex'
let pathname = window.location.pathname;
export default {
  components: { navigation, topHeader },
  setup() {
    const { proxy } = getCurrentInstance();
    const router = useRouter()
    const store = useStore()
    const page_data = reactive({
      exclude: [],
      route_exclude: [undefined, "login", "notFound"]
    })
    if (pathname == "/") {
      judgeUserLogin()
    } else {
      judgeUserLogin()
    }
    function judgeUserLogin() {
      if (sessionStorage.getItem("supplierLogin")) {
        proxy.$localForage.getItem("looovoSupplier").then(async res => {
          if (res) {
            console.log("App--更新vuex用户信息！")
            await store.dispatch("user/updateUserInfo", res);
            router.push({ name: "homePage" })
          } else {
            router.push({ name: 'login' })
          }
        })
      } else {
        router.push({ name: 'login' })
      }
    }
    return { ...toRefs(page_data), judgeUserLogin }
  }
}
</script>

<style lang="less" scoped>
#view {
  height: 100%;
  width: 100%;
  min-width: 320px;
  position: absolute;
  top: 0px;
  left: 0px;
  -webkit-overflow-scrolling: touch;
  background: url("../static/image/home_back.png") no-repeat;
  background-size: 100% 410px;
  .main {
    padding: 0;
    margin: 0;
    .main_padding {
      min-height: 720px;
      margin: 20px 20px 0px 20px;
      border-radius: 6px;
      overflow: auto;
      border: 1px solid rgba(220, 223, 230, 0.3);
    }
  }
  .content {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .content_main {
      overflow: auto;
      .topHeader {
        height: 80px;
      }
    }
  }
}
</style>