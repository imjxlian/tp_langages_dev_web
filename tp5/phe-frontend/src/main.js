import { createApp } from 'vue';
import ElementPlus from 'element-plus';

import { router } from './router';
import { store } from './store';

import 'element-plus/dist/index.css';
import './styles/index.css';

import App from './App.vue';

const app = createApp(App);

app.use(router);
app.use(store);
app.use(ElementPlus);

app.mount('#app');
