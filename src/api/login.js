import fly from "../interceptor/fly.interceptor"; // fly拦截器

/**
 * 登陆接口
 */
export function login(data) {
  return Promise.all([fly.post(import.meta.env.VITE_VUE_APP_BASE_URL2 + "loginProvider", data)])
    .then(([_loginProvider]) => {
      const userInfo = Object.assign(_loginProvider.data);
      return userInfo;
    });
}