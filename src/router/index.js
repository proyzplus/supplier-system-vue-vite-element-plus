/*
 * @Author: proyzplus
 * @Date: 2021-06-08 16:36:16
 * @LastEditors: proyzplus
 * @LastEditTime: 2021-06-08 16:53:59
 * @Description: Description
 */
import { createRouter, createWebHistory } from 'vue-router';
import warehouse from './warehouse';
import commod from './commod';
import finance from './finance';

const routes = [
  {
    path: "/",
    name: "login",
    hidden: true,
    meta: {
      title: "登录"
    },
    component: () => import("../views/login/login.vue"),
  },
  ...warehouse,
  ...commod,
  ...finance
]

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router
