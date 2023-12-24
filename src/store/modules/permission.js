const state = () => ({
  isLogined: false,
});
const getters = {
  isLogined: (state) => state.isLogined,
};
const mutations = {
  setLogined(state, loginFlag) {
    state.isLogined = loginFlag;
  },
  setNoLogin: (state, loginFlag) => {
    state.isLogined = loginFlag;
  },
};
const actions = {
  setLogined({ commit }) {
    commit("setLogined", true);
  },
  setNoLogin({ commit }) {
    commit("setNoLogin", false);
  },
};
export default { state, getters, mutations, actions };
