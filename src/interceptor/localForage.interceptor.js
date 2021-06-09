import localForage from "localforage"
import store from "../store";

localForage.config(store.state.config.localForage);

const proxy_localForage = new Proxy(localForage, {});

export default proxy_localForage;