import { createRouter, createWebHistory } from 'vue-router';
import Game from '../components/Game.vue';
import Admin from '../components/Admin.vue';

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

export default router;