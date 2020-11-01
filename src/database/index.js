import Sequelize from 'sequelize'

import Company from '../app/models/Company'
import Queue from '../app/models/Queue'
import User from '../app/models/User'
import Position from '../app/models/Position'

import databaseConfig from '../config/database'

const models = [Company, Queue, User, Position]

class Database {
  constructor () {
    this.init()
  }

  init () {
    this.connection = new Sequelize(databaseConfig)

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models))
  }
}

export default new Database()
