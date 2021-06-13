import fly from "../interceptor/fly.interceptor"; // fly拦截器

/**
 * 获取商品列表
 */
export function listCommond(data) {
  return fly.get(import.meta.env.VITE_VUE_APP_BASE_URL2 + "listCommond", {
    params: data,
  });
}  