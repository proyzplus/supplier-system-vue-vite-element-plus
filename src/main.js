import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import router from './router/index';
import vuex from 'vuex';
import store from './store/index';
import "./assets/css/common.less";
import "./assets/css/animate.less";
import "./assets/css/element.less";
import "./assets/css/reset.less";   //重置element 样式
import localForage from "./interceptor/localForage.interceptor"; //localForage拦截器
import moment from 'moment';
import 'dayjs/locale/zh-cn'
import locale from 'element-plus/lib/locale/lang/zh-cn';

import icon from './components/core/icon/icon.vue';
import currency_table from './components/table_template/currency_table.vue';
import DatePicker from './components/datePicker/date-picker.vue';



const app = createApp(App);
app.use(router);
app.use(store);
app.use(vuex);
app.use(ElementPlus, { locale });
app.component("icon", icon);
app.component("currency_table", currency_table);
app.component("DatePicker", DatePicker);
app.config.globalProperties.$localForage = localForage;
app.config.globalProperties.$moment = moment;

app.mount('#app');
