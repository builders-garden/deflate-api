import { Router } from 'express';
import { authMiddleware } from '../../../middlewares/auth';
import { healthCheck } from '../../../handlers/health';
import { protectedRoute } from '../../../handlers/protected';

const router = Router();

// Define routes with their specific handlers and middleware
const routes = [
  {
    path: '/health',
    method: 'get',
    handler: healthCheck,
    middleware: []
  },
  {
    path: '/kyc',
    method: 'get',
    handler: protectedRoute,
    middleware: [authMiddleware]
  },
  {
    path: '/bank-accounts',
    method: 'post',
    handler: protectedRoute,
    middleware: [authMiddleware]
  },
  {
    path: '/bank-accounts/:id',
    method: 'put',
    handler: protectedRoute,
    middleware: [authMiddleware]
  }
];

// Register routes
routes.forEach(route => {
  const { method, path, handler, middleware } = route;
  (router[method as keyof Router] as Function)(path, ...middleware, handler);
});

export default router;