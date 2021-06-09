/*
 * @Author: proyzplus
 * @Date: 2021-06-06 19:37:42
 * @LastEditors: proyzplus
 * @LastEditTime: 2021-06-07 14:11:19
 * @Description: Description
 */
export default [
  {
    path: "/commod",
    name: "commod",
    meta: {
      title: "商品管理"
    },
    redirect: {
      name: "commodityManager",
    },
    component: () => import("../views/default.vue"),
    children: [
      {
        path: "commodityManager",
        name: "commodityManager",
        component: () => import("../views/commod/index.vue"),
        meta: {
          title: "商品管理",
        },
      }
    ],
  },
];
