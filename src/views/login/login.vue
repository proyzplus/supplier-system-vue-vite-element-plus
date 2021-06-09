<template>
  <div class="loginHtmls">
    <div class="loginHtml">
      <div class="loginLooove">
        <img src="../../../static/image/login/logo.png" alt="">
        <p>欢迎登录供应商管理平台</p>
      </div>
      <div class="loginForm">
        <div class="formtopLists">
          <div class="formtopList">
            <div class="listOnner" @mouseenter="enter('donw')" @mouseleave="leave('donw')">
              <el-tooltip placement="bottom" effect="light">
                <template #content>
                  <p class="hoverSt" @click="open('https://www.pgyer.com/eqwP')">默认地址</p>
                  <p class="hoverSt" @click="open('https://image.looovo.com/supermarket-release.apk')">备用地址</p>
                </template>
                <div>
                  <img v-if="down" src="../../../static/image/login/download_click.png" alt="">
                  <img v-else src="../../../static/image/login/download.png" alt="">
                  <p v-if="down" style="color:#ff6900;">下载应用</p>
                  <p v-else>下载应用</p>
                </div>
              </el-tooltip>
            </div>
            <div class="listOnner" @mouseenter="enter('admin')" @mouseleave="leave('admin')" @click="open('http://k2.looovo.com/#/login')">
              <img v-if="admin" src="../../../static/image/login/admin_click.png" alt="">
              <img v-else src="../../../static/image/login/admin.png" alt="">
              <p v-if="admin" style="color:#ff6900;">门店后台</p>
              <p v-else>门店后台</p>
            </div>
            <div class="listOnner" @mouseenter="enter('qq')" @mouseleave="leave('qq')">
              <a target="_blank" style="text-decoration: none;" href="http://wpa.qq.com/msgrd?v=3&uin=66901404&site=qq&menu=yes">
                <img v-if="qq" src="../../../static/image/login/qq_click.png" alt="">
                <img v-else src="../../../static/image/login/qq.png" alt="">
                <p v-if="qq" style="color:#ff6900;">QQ交谈</p>
                <p v-else>QQ交谈</p>
              </a>
            </div>
            <div @mouseenter="enter('wechat')" @mouseleave="leave('wechat')" class="listOnner">
              <el-tooltip placement="bottom" effect="light">
                <template #content>
                  <img src="../../../static/image/login/kefu.jpg" style="width:120px;height:120px;" alt="">
                </template>
                <div>
                  <img v-if="wechat" src="../../../static/image/login/erweima_click.png" alt="">
                  <img v-else src="../../../static/image/login/erweima.png" alt="">
                  <p v-if="wechat" style="color:#ff6900;">客&nbsp;&nbsp;&nbsp;服</p>
                  <p v-else>客&nbsp;&nbsp;&nbsp;服</p>
                </div>
              </el-tooltip>
            </div>
          </div>
        </div>
        <div class="formform">
          <div class="form_title">
            <p>登录</p>
          </div>
          <div class="form_table">
            <el-form class="form" :model="formData">
              <el-form-item>
                <div class="username">
                  <div class="editClass">
                    <icon class="iconStyle" name="icon-shanghuhoutaiiconqueren-6"></icon>
                    <input class="myinput" placeholder="账号" v-model.trim="formData.name">
                  </div>
                </div>
              </el-form-item>
              <el-form-item>
                <div class="username">
                  <div class="editClass">
                    <icon class="iconStyle" name="icon-icon_password"></icon>
                    <input class="myinput" v-model.trim="formData.password" type="password" @keyup.enter="onSubmit" placeholder="密码">
                  </div>
                </div>
              </el-form-item>
              <el-form-item class="bottom">
                <div class="line">
                  <el-button class="tt" type="primary" @click="onSubmit">登录</el-button>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
    <div class="Copyright">
      <span>Copyright© 2006 - {{(new Date()).getFullYear()}} 粤ICP备18013531号-1</span>
    </div>
  </div>
</template>
<script>
import { reactive, toRefs, getCurrentInstance, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { login } from '../../api/login'
import md5 from 'md5'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {
  name: "Home",
  setup() {
    const store = useStore()
    const router = useRouter()
    const { proxy } = getCurrentInstance()
    const page_data = reactive({
      formData: {
        name: "haoduo@xinyuka",
        password: "123456"
      },
      down: false,
      admin: false,
      qq: false,
      wechat: false
    })
    onMounted(() => {
      sessionStorage.setItem("supplierLogin", false)
    })
    const enter = val => {
      page_data[val] = true
    }
    const leave = val => {
      page_data[val] = false
    }
    const onSubmit = () => {
      if (!page_data.formData.name || !page_data.formData.password) {
        ElMessage.warning({
          message: '请输入正确的账号密码哟(＾Ｕ＾)ノ~ＹＯ',
          type: 'warning'
        });
      } else {
        let data = {
          name: page_data.formData.name,
          password: JSON.parse(JSON.stringify(page_data.formData.password))
        }
        data.password = md5(data.password)
        login(data).then(res => {
          ElMessage.success({
            message: '恭喜你，登陆成功啦ヾ(≧▽≦*)o',
            type: 'success'
          });
          store.dispatch("user/updateUserInfo", res);
          sessionStorage.setItem("supplierLogin", true)
          proxy.$localForage.setItem("looovoSupplier", res);
          router.push({ name: "homePage" })
        })
      }
    }
    const open = val => {
      window.open(val);
    }
    return { ...toRefs(page_data), enter, leave, onSubmit, open }
  }
}
</script>
<style lang="less" scoped>
.hoverSt {
  line-height: 36px;
  padding: 0px 24px;
}
.hoverSt:hover {
  color: #ff6900;
  cursor: pointer;
}
.loginHtmls {
  width: 100%;
  height: 100%;
  background-image: url(../../../static/image/login/back.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  .iconStyle {
    margin-left: 6px;
    line-height: 68px;
  }
  .loginHtml {
    width: 100%;
    height: 93%;
    display: flex;
    justify-content: space-between;
    .loginLooove {
      img {
        width: 280px;
        height: 86px;
        margin-left: 36px;
        margin-top: 52px;
      }
      p {
        font-size: 54px;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        line-height: 80px;
        letter-spacing: 4px;
        margin-left: 100px;
      }
    }
    .loginForm {
      width: 700px;
      margin-right: 100px;
      margin-top: 70px;
      .formform {
        width: 600px;
        padding-bottom: 140px;
        margin: auto;
        background: rgba(68, 71, 92, 1);
        border-radius: 8px;
        .form_title {
          width: 180px;
          height: 70px;
          letter-spacing: 4px;
          background-image: url(../../../static/image/login/shape.png);
          background-size: 100% 100%;
          color: #ffffff;
          text-align: center;
          line-height: 70px;
          margin: auto;
          position: relative;
          top: -35px;
          font-size: 26px;
        }
        .form_table {
          width: 80%;
          margin: auto;
          margin-top: 50px;
          .editClass {
            width: 80%;
            height: 64px;
            line-height: 64px;
            margin: auto;
            display: flex;
            flex-wrap: wrap;
            background: rgba(51, 53, 65, 1);
            border-radius: 8px;
            .myinput {
              background-color: rgba(51, 53, 65, 1) !important;
              margin-left: 6px;
              width: 80%;
              height: 60px;
              // margin-top: 4px;
              border: 0;
              color: #ffffff;
              outline: none !important;
              font-size: 18px;
            }
          }
          .line {
            width: 80%;
            margin: auto;
          }
        }
      }
      .formtopLists {
        width: 100%;
        height: 160px;
        margin-top: -34px;
        margin-bottom: 52px;
        .formtopList {
          width: 320px;
          display: flex;
          justify-content: space-between;
          float: right;
          margin-right: 28px;
          .listOnner {
            width: 90px;
            height: 90px;
            text-align: center;
            cursor: pointer;
            img {
              width: 36px;
              height: 36px;
            }
            p {
              font-size: 14px;
              color: rgba(255, 255, 255, 1);
              line-height: 28px;
            }
          }
        }
      }
      .loginLooove {
        img {
          width: 270px;
          height: 90px;
          margin-left: 36px;
          margin-top: 52px;
        }
        p {
          font-size: 54px;
          font-weight: 500;
          color: rgba(255, 255, 255, 1);
          line-height: 80px;
          letter-spacing: 4px;
          margin-left: 100px;
        }
      }
    }
  }
}
.formtopList {
  width: 100%;
  display: none;
  margin-top: 54px;
  .formtopList {
    width: 240px;
    display: flex;
    justify-content: space-between;
    margin: auto;
    .listOnner {
      width: 90px;
      text-align: center;
      img {
        width: 28px;
        height: 28px;
      }
      p {
        font-size: 10px;
        color: rgba(255, 255, 255, 1);
        line-height: 28px;
      }
    }
  }
}
.Copyright {
  width: 375px;
  margin: auto;
  span {
    font-size: 16px !important;
    color: rgba(255, 255, 255, 1);
    line-height: 20px;
    opacity: 0.2;
  }
}
.downwechat {
  width: 120px;
  height: 120px;
  position: absolute;
  top: 152px;
  right: 90px !important;
}
.wechat {
  width: 120px;
  height: 120px;
  position: absolute;
  top: 152px;
  right: 110px;
}
input:-webkit-autofill,
textarea:-webkit-autofill,
select:-webkit-autofill {
  box-shadow: 0 0 0 1000px #333541 inset;
  -webkit-text-fill-color: #fff;
}
input[type="text"]:focus,
input[type="password"]:focus,
textarea:focus {
  box-shadow: 0 0 0 1000px #333541 inset;
  -webkit-text-fill-color: #fff;
}
.tt {
  width: 100%;
  background: #ff6900 !important;
  border: 1px solid #ff6900;
  margin-top: 60px;
  height: 60px;
  font-size: 26px;
  color: rgba(255, 255, 255, 1);
  letter-spacing: 4px;
}
</style>
