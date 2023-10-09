import { createRouter, createWebHistory } from 'vue-router';

import { store } from '@/store';

import Home from '../pages/Home.vue';
import Login from '../pages/Login.vue';
import Race from '../pages/Race.vue';

export const router = createRouter({
    routes: [
        { path: '/', name: 'Home', component: Home },
        { path: '/race', name: 'Race', meta: { needLogged: true }, component: Race },
        { path: '/login', name: 'Login', meta: { needNotLogged: true }, component: Login },
        { path: '/:pathMatch(.*)*', redirect: '/' }, // If path not found, redirect to Home
    ],
    history: createWebHistory(),
});

router.beforeEach((to, from, next) => {
    if (to.meta.needLogged && !store.state.loggedIn) {
        return next({ name: 'Login' });
    }

    if (to.meta.needNotLogged && store.state.loggedIn) {
        return next({ name: 'Home' });
    }

    return next();
});
