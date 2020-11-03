import { Router } from 'express'

import UserController from './app/controllers/UserController'
import CompanyController from './app/controllers/CompanyController'
import QueueController from './app/controllers/QueueController'
import SessionController from './app/controllers/SessionController'

import authMiddleware from './app/middleware/auth'
import { wrap } from './app/middleware/wrapper'

const routes = new Router()

/* Rotas que não precisam de autenticação */
routes.post('/session', wrap(SessionController.store))

routes.post('/company', wrap(CompanyController.store))

routes.get('/user/:userId', wrap(UserController.list))
routes.get('/user/queue/:queueId', wrap(QueueController.listQueueUsers))
routes.post('/user', wrap(UserController.store))
routes.post('/user/:userId', wrap(QueueController.addUserToQueue))

/* Autenticação da Company */
routes.use(authMiddleware)

/* Rotas que precisam estar autenticado com uma Company */
routes.get('/company/:companyId', wrap(CompanyController.list))
routes.put('/company/:companyId', wrap(CompanyController.update))
routes.delete('/company/:companyId', wrap(CompanyController.remove))

routes.get('/queue', wrap(QueueController.listAll))
routes.get('/queue/:queueId', wrap(QueueController.list))
routes.post('/queue', wrap(QueueController.store))
routes.put('/queue/:queueId', wrap(QueueController.update))
routes.delete('/queue/:queueId', wrap(QueueController.remove))
routes.post('/queue/:queueId/user', wrap(QueueController.handleUserFromQueue))

export default routes
