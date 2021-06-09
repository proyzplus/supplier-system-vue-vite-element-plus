<template>
  <div class="default">
    <router-view></router-view>
  </div>
</template>

<script>
import { reactive, toRefs, getCurrentInstance, onMounted } from 'vue'
import { useRouter, onBeforeRouteUpdate, onBeforeRouteLeave } from 'vue-router'
import { useStore } from 'vuex'
export default {
  name: "default",
  setup() {
    const { proxy } = getCurrentInstance();
    const router = useRouter();
    const store = useStore();
    const page_data = reactive({
    })
    onMounted(async () => {
      await proxy.$localForage.getItem("looovoSupplier").then(async res => {
        if (res) {
          await store.dispatch("user/updateUserInfo", res);
        } else {
          router.push({ name: 'login' })
        }
      })
    })
    onBeforeRouteUpdate((to, from) => {
      console.log(to, "路由更改");
    });
    onBeforeRouteLeave((to, from) => {
      if (to.name === "login") {
        console.log("去登陆，不需要管");
        return false;
      } else {
        updateUserInfo(to);
      }
    });
    const updateUserInfo = (val) => {
      // 判断用户有没有登录
      if (!sessionStorage.getItem("supplierLogin")) {
        return router.push({ name: 'login' })
      }
      // 同步vuex的信息 并看有没有登陆
      if (store.state.user.userInfo.name) {
        if (val.name === "login" && store.state.user.userInfo.jwt.length !== 0) {
          router.push({
            name: "home",
          });
          //如果当前不是跳转到login页面 但是却没有登录  则跳转到login页面
        } else if (
          val.name !== "login" &&
          store.state.user.userInfo.jwt.length === 0
        ) {
          router.push({
            name: "login",
          });
        }
      } else {
        ctx.$localForage.getItem("looovoSupplier").then(async (res) => {
          await store.dispatch("user/updateUserInfo", res);
          if (val.name === "login" && store.state.user.userInfo.jwt.length !== 0) {
            router.push({
              name: "homePage",
            });
          } else if (
            val.name !== "login" &&
            store.state.user.userInfo.jwt.length === 0
          ) {
            router.push({
              name: "login",
            });
          }
        });
      }
    };
    return { ...toRefs(page_data) }
  }
}
</script>

<style scoped>
</style>
