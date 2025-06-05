import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import Game from './components/Game.vue';
import Admin from './components/Admin.vue';

// CSS import
import './assets/main.css';
import './assets/base.css';

const routes = [
  {
    path: '/',
    component: Game,
  },
  {
    path: '/admin',
    component: Admin,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

const app = createApp(App);
app.use(router);
app.mount('#app');