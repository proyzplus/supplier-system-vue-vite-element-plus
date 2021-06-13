/*
 * @Author: proyzplus
 * @Date: 2021-06-06 19:37:42
 * @LastEditors: proyzplus
 * @LastEditTime: 2021-06-07 14:11:19
 * @Description: Description
 */
export default [
  {
    path: "/finance",
    name: "finance",
    meta: {
      title: "财务管理",
      num: 2
    },
    redirect: {
      name: "supplierReconciliation",
    },
    component: () => import("../views/default.vue"),
    children: [
      {
        path: "supplierReconciliation",
        name: "supplierReconciliation",
        component: () => import("../views/finance/index.vue"),
        meta: {
          title: "供应商对账",
        },
      }
    ],
  },
];
