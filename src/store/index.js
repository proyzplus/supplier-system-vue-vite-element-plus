import {createStore} from 'vuex';
import user from "./user";
import config from './config';

export default createStore({
    modules: {
        user: user,
        config: config
    }
});
