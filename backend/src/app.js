import express from 'express'
import routes from './routes'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'
import path from 'path'

import './database'

const swaggerDocs = YAML.load(path.join(__dirname, '../docs/api/openapi.yaml'))

class App {
  constructor () {
    this.server = express()

    this.middlewares()
    this.routes()
  }

  middlewares () {
    this.server.use('/api-docs',
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocs))
    this.server.use(express.json())
    this.server.use(cors())
  }

  routes () {
    this.server.use(routes)
  }
}

export default new App().server
