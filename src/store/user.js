export default {
  namespaced: true,
  state: {
    isLoading: false,
    userInfo: { id: null, name: "yztest", jwt: null }
  },
  mutations: {
    setLoading(state, payload) {
      state.isLoading = payload;
    },
    setUserInfo(state, payload) {
      state.userInfo = payload
    }
  },
  actions: {
    async updateUserInfo(ctx, val) {
      ctx.commit('setLoading', true);
      ctx.commit('setUserInfo', val);
    }
  }
};