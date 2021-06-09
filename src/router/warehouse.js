/*
 * @Author: proyzplus
 * @Date: 2021-06-06 19:37:42
 * @LastEditors: proyzplus
 * @LastEditTime: 2021-06-07 14:11:19
 * @Description: Description
 */
export default [
  {
    path: "/warehouse",
    name: "warehouse",
    meta: {
      title: "仓储管理"
    },
    redirect: {
      name: "homePage",
    },
    component: () => import("../views/default.vue"),
    children: [
      {
        path: "homePage",
        name: "homePage",
        component: () => import("../views/warehouse/index.vue"),
        meta: {
          title: "仓储首页",
        },
      }, {
        path: "supplyWarehouse",
        name: "supplyWarehouse",
        component: () => import("../views/warehouse/supply_warehouse.vue"),
        meta: {
          title: "仓储供货",
        },
      }
    ],
  },
];
