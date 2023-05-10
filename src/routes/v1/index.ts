import express, { Router } from 'express';
import { HealthRoutes } from './health.route';
import UserRoutes from './user.routes';
import AuthRoutes from './auth.routes';

const router = express.Router();

interface Route {
  path: string;
  routes: Router;
}

const routes: Route[] = [
  {
    path: '/health-check',
    routes: HealthRoutes,
  },
  {
    path: '/users',
    routes: UserRoutes,
  },
  {
    path: '/auth',
    routes: AuthRoutes,
  },
];

routes.forEach((route: Route) => {
  router.use(route.path, route.routes);
});

export { router };
