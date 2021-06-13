import fly from "../interceptor/fly.interceptor"; // fly拦截器

/**
 * 获取供应商往来账列表
 */
export function providerCurrentAccountList(data) {
  return fly.get(import.meta.env.VITE_VUE_APP_BASE_URL2 + "providerCurrentAccount/list", {
    params: data,
  });
}

// 供应商确认对账单
export function providerConfirm(id, data) {
  return this.$fly.post(import.meta.env.VITE_VUE_APP_BASE_URL2 + "providerCurrentAccount/providerConfirm/" + id, data);
}