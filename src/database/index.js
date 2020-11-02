import Sequelize from 'sequelize'

import fs from 'fs/promises'
import path from 'path'

import databaseConfig from '../config/database'

class Database {
  constructor () {
    this.init()
  }

  async init () {
    this.connection = new Sequelize(databaseConfig)

    const directoryPath = path.join(__dirname, '../app/models')
    const models = await fs.readdir(directoryPath)

    models
      .map(model => require(`../app/models/${model}`).default)
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models))
  }
}

export default new Database()
