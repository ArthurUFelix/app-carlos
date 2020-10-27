import { Router }  from 'express'

import UserController from './app/controllers/UserController'
import CompanyController from './app/controllers/CompanyController'
import QueueController from './app/controllers/QueueController'
import SessionController from './app/controllers/SessionController'

import authMiddleware from './app/middleware/auth'

const routes = new Router()

// Rotas que não precisam de autenticação
routes.post('/company', CompanyController.store)
routes.post('/user', UserController.store)
routes.post('/session', SessionController.store)

routes.use(authMiddleware)

// Rotas que precisam estar autenticado com uma Store
routes.put('/company', CompanyController.update)
routes.post('/queue', QueueController.store)

export default routes
