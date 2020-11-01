import { Router } from 'express'

import UserController from './app/controllers/UserController'
import CompanyController from './app/controllers/CompanyController'
import QueueController from './app/controllers/QueueController'
import SessionController from './app/controllers/SessionController'
import PositionController from './app/controllers/PositionController'

import authMiddleware from './app/middleware/auth'
import { wrap } from './app/middleware/wrapper'

const routes = new Router()

/* Rotas que não precisam de autenticação */
routes.post('/session', wrap(SessionController.store))

routes.get('/company', wrap(CompanyController.list))
routes.post('/company', wrap(CompanyController.store))

routes.get('/queue', wrap(QueueController.list))

routes.get('/user', wrap(UserController.list))
routes.post('/user', wrap(UserController.store))
routes.put('/user/:id', wrap(UserController.update))
routes.delete('/user/:id', wrap(UserController.remove))

routes.post('/position', wrap(PositionController.store))

/* Autenticação da Company */
routes.use(authMiddleware)

/* Rotas que precisam estar autenticado com uma Company */
routes.put('/company/:id', wrap(CompanyController.update))
routes.delete('/company/:id', wrap(CompanyController.remove))

routes.post('/queue', wrap(QueueController.store))
routes.put('/queue/:id', wrap(QueueController.update))
routes.delete('/queue/:id', wrap(QueueController.remove))

export default routes
