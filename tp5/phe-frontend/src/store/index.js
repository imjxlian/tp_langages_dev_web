import { createStore } from 'vuex';
import { supprimerParis } from '../api/paris';

export const store = new createStore({
  state: {
    loggedIn: localStorage.getItem('username') !== null,
    username: localStorage.getItem('username') || '',
    etat: 'En attente Paris',
    chevalGagnant: null
  },
  mutations: {
    login(state, username) {
      state.loggedIn = true;
      state.username = username;
    },
    logout(state) {
      state.loggedIn = false;
      state.username = '';
    },
    updateEtat(state, etat) {
      state.etat = etat;
    },
    setChevalGagnant(state, chevalGagnant) {
      state.chevalGagnant = chevalGagnant;
    }
  },
  actions: {
    login: ({ commit }, username) => {
      localStorage.setItem('username', username);
      commit('login', username);
    },
    logout: ({ commit }) => {
      localStorage.removeItem('username');
      commit('logout');
    },
    raceStarting: ({ commit }) => {
      commit('updateEtat', 'En cours');
    },
    raceEnding: ({ commit }, chevalGagnant) => {
      commit('updateEtat', 'Terminée');
      commit('setChevalGagnant', chevalGagnant);
    },
    chevauxBox: async ({ commit, state }) => {
      if (state.etat == "Terminée") {
        await supprimerParis();
      }
      commit('updateEtat', 'En attente Paris');
      commit('setChevalGagnant', null);
    }
  },
  getters: {
    username: state => state.username,
    loggedIn: state => state.loggedIn,
    etat: state => state.etat,
    chevalGagnant: state => state.chevalGagnant
  },
});
