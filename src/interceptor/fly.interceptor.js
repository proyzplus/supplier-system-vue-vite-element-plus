import axios from "axios";
import localForage from "../interceptor/localForage.interceptor"; //localForage拦截器
import { ElMessage } from 'element-plus';
import store from '../store/index';

const fly = axios.create({
    baseURL: import.meta.env.VITE_VUE_APP_BASE_URL,
    withCredentials: true,
});

// 请求拦截器
fly.interceptors.request.use(function (request) {
    // if (localStorage.getItem('current')) {
    //     store.dispatch("update_loading_show", false);
    // } else {
    //     store.dispatch("update_loading_show", true);
    // }
    return new Promise(async (resolve, reject) => {
        let jwt = store.state.user.userInfo.jwt;
        if (!jwt) {
            try {
                jwt = (await localForage.getItem("looovoSupplier")).jwt;
            } catch (e) {
                console.error();
            }
        }
        if (!request.url.includes("login")) {
            request.headers["x-authorization-token"] = jwt;
        }
        if (!(request.method.toLowerCase() === "get")) {
            return resolve(request);
        } else {
            return resolve(request);
            // if (store.state.config.core.api.cache.enable) {
            //     localForage.getItem(JSON.stringify(request)).then(res => { 
            //         if (res && res.data && res.cacheTime && new Date().getTime() - res.cacheTime <= store.state.config.core.api.cache.expiresIn) {
            //             store.dispatch("update_loading_show", false);
            //             return resolve(res.data);
            //         } else {
            //             return resolve(request);
            //         }
            //     });
            // } else {
            //     return resolve(request);
            // }
        }
    });
});

// 返回拦截器
fly.interceptors.response.use(
    async function (response) {
        if (localForage.getItem("looovoSupplier")) {
            if (!response.request.method) {
                response.request.method = response.config.method;
            }
            //关闭loading加载动画
            // store.dispatch("update_loading_show", false);
            if (response.data.error_msg === "jwt过期，请重新登录") { //新接口jwt过期
                localForage.clear();
                sessionStorage.setItem("nowUser", "");
                ElMessage.error("登录信息失效,请重新登录");
                setTimeout(() => {
                    location.reload();
                }, 300);
                return Promise.reject("登录信息失效,请重新登录");
            }
            if (response.data.code == "401") { //老接口cookie过期
                localForage.clear();
                sessionStorage.setItem("nowUser", "");
                ElMessage.error("登录信息失效,请重新登录");
                setTimeout(() => {
                    location.reload();
                }, 300);
                return Promise.reject("登录信息失效,请重新登录");
            }
            if (response.data.msg || response.data.err || response.data.error_msg) {
                if (response.data.error_msg == 'jwt过期，请重新登录') {
                    return false;
                } else {
                    if (response.data.error_extra) {
                        setTimeout(function () {
                            ElMessage.error("Network：" + (response.data.error_extra));
                        }, 300);
                    }
                    ElMessage.error("Network：" + (response.data.msg || response.data.err || response.data.error_msg));
                    return Promise.reject(response.data.msg || response.data.err || response.data.error_msg);
                }
            }
            try {
                //清除Content-Type
                response.request.headers["Content-Type"] = "";
            } catch (e) {
                response.headers["Content-Type"] = "";
            }
            // if (store.state.config.core.api.cache.enable) {
            //     // 如果当前请求是get 则缓存本次请求
            //     if (response.request.method.toLowerCase() === "get") {
            //         localForage.setItem(
            //             JSON.stringify(response.request), {
            //             cacheTime: new Date().getTime(),
            //             data: response.data
            //         }
            //         );
            //     }
            // }
            return response.data;
        }
    },
    async function (err) {
        if (localForage.getItem("looovoSupplier")) {
            // store.dispatch("update_loading_show", false);
            if (err == 'Error: Request failed with status code 401') {
                localForage.clear();
                sessionStorage.setItem("nowUser", "");
                ElMessage.error("登录信息失效,请重新登录");
                setTimeout(() => {
                    location.reload();
                }, 1300);
                return Promise.reject("登录信息失效,请重新登录");
            }
            if (err.status === 401) {
                ElMessage.error("Network：" + err);
                localForage.clear();
                location.reload();
            } else {
                ElMessage.error(err);
            }
            return Promise.reject(err);
        }
    }
);

export default fly;