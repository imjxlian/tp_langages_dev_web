import { createStore } from 'vuex';

export const store = new createStore({
  state: {
    loggedin: localStorage.getItem('username') || false,
    username: localStorage.getItem('username') || '',
  },
  mutations: {
    login: (state, username) => {
      state.loggedin = true;
      state.username = username;
      localStorage.setItem('username', username);
    },
    logout: (state) => {
      state.loggedin = false;
      state.username = '';
      localStorage.removeItem('username');
    }
  },
  actions: {
    login: ({commit}, username) => {
      commit('login', username);
    },
    logout: ({commit}) => {
      commit('logout');
    }
  },
  getters: {
    username: (state) => {
      return state.username;
    },
    loggedin: (state) => {
      return state.loggedin;
    }
  },
});
