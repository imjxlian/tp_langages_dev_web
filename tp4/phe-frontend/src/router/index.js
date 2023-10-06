import { createRouter, createWebHistory } from 'vue-router';
import { useStore } from 'vuex';

import Home from '../pages/Home.vue';
import Race from '../pages/Race.vue';
import Login from '../pages/Login.vue';

const store = useStore();

export const router = createRouter({
    routes: [
      {path: '/', component: Home},
      {path: '/race', component: Race},
      {path: '/login', component: Login},
      {path: '/:catchAll(.*)', redirect: '/' }
    ],
    history: createWebHistory(),
});
