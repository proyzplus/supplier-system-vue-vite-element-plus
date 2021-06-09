<template>
  <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <div class="Loading_Loading" v-if="isShow">
      <section class="outside">
        <div class="main">
          <div class="lds-dual-ring" v-if="defaultAnimation">
            <section class="content">
              <span>{{percentage}}</span>
            </section>
          </div>
          <div class="slot">
            <slot></slot>
          </div>
        </div>
      </section>
    </div>
  </transition>
</template>

<script>
export default {
  name: "loading",
  props: {
    isShow: [Boolean],
    defaultAnimation: [Boolean],
    percentage: {
      type: String,
      default: "Loading..."
    }
  }
};
</script>

<style lang="less" scoped>
.lds-dual-ring {
  @keyframes lds-dual-ring {
    0% {
      transform: rotate(0deg) scale(2);
    }
    100% {
      transform: rotate(360deg) scale(2);
    }
  }
  position: relative;
  &:after {
    content: " ";
    display: block;
    width: 46px;
    height: 46px;
    margin: 1px;
    border-radius: 50%;
    border: 5px solid;
    border-color: white transparent white transparent;
    animation: lds-dual-ring 1.2s linear infinite;
  }
  .content {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    align-content: center;
    justify-content: center;
    justify-items: center;
    color: white;
  }
}

.Loading_Loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 99999;
  .outside {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    align-content: center;
    justify-content: center;
    justify-items: center;
    color: white;
    .main {
      position: relative;
      display: flex;
      align-items: center;
      align-content: space-between;
      justify-content: center;
      justify-items: center;
      flex-flow: column;
      color: white;
    }
  }
}
</style>