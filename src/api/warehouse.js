import fly from "../interceptor/fly.interceptor"; // fly拦截器

/**
 * 获取仓库配送单列表
 */
export function listWarehouseExpressOrder(data) {
  return fly.get(import.meta.env.VITE_VUE_APP_BASE_URL2 + "warehouseExpressOrder/list", {
    params: data,
  });
}

/**
 * 仓储供货单数量
 */
export function providerGetStatusCount(data) {
  return fly.get(import.meta.env.VITE_VUE_APP_BASE_URL2 + "providerProcurementOrder/providerGetStatusCount", {
    params: data,
  });
}