<template>
  <div class="topHeader_topHeader">
    <div class="innerContent">
      <div class="breadcrumb" style="padding-left:24px;">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>
            <span style="font-weight:600;cursor: pointer;">首页</span>
          </el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: item.name }" v-for="(item, index) of $route.matched" :key="index">
            <span>{{ item.meta.title }}</span>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="line">
        <div class="userInfo">
          <div class="avatar">
            <div class="img_box">
              <img v-if="$store.state.user.userInfo.logo" :src="$store.state.user.userInfo.logo">
              <img src="../../static/image/userLogo.jpg">
            </div>
            <div class="name">
              <span>{{ $store.state.user.userInfo.name }}</span>
            </div>
            <div class="panel" @click="logout">
              <icon name="icon-icon_houtai-28"></icon>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'
export default {
  setup() {
    const { proxy } = getCurrentInstance()
    const page_data = reactive({
      userName: ""
    })
    const logout = () => {
      proxy.$confirm('当你点击确定按钮之后，将在一秒钟后退出系统！', '是否退出系统？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ElMessage.success({
          message: '感谢你的此次使用！',
          type: 'success'
        });
        setTimeout(() => {
          proxy.$localForage.clear();
          const origin = window.location.origin;
          location.replace(origin)
        }, 600);
      }).catch(() => {
        ElMessage.success({
          message: '感谢您的支持与信任！',
          type: 'success'
        });
      });
    }
    return { ...toRefs(page_data), logout }
  }
}
</script>

<style lang="less" scoped>
.topHeader_topHeader {
  color: white;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  .innerContent {
    color: white;
    width: 100%;
    height: 80px;
    display: flex;
    align-items: center;
    .menu {
      width: 180px;
      img {
        width: 138px;
        height: 68px;
      }
    }
    .breadcrumb {
      flex: 1;
      .el-breadcrumb {
        font-size: 17px;
      }
      .el-breadcrumb__inner {
        span {
          color: #fff;
        }
      }
    }
    .line {
      padding: 0 10px;
      .userInfo {
        .avatar {
          .panel {
            width: 27px;
            height: 27px;
            cursor: pointer;
            .Icon_Icon /deep/ .Icon_Icon_iconfont {
              width: 1.8em;
              height: 1.8em;
              font-weight: 700;
            }
          }
          display: flex;
          justify-items: center;
          align-items: center;
          .img_box {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 1px #fff solid;
            img {
              border-radius: 50%;
              display: inline-block;
              height: auto;
              max-width: 100%;
              object-fit: contain;
              width: 100%;
              height: 100%;
            }
          }
          .name {
            font-size: 20px;
            flex: 1;
            padding: 0 1rem;
          }
        }
      }
    }
  }
}
</style>
