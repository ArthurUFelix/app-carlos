import Sequelize, { Model } from 'sequelize'

class User extends Model {
  static init (sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        phone: Sequelize.STRING
      },
      {
        sequelize
      }
    )

    return this
  }

  static associate (models) {
    this.belongsTo(models.Queue, { foreignKey: 'queueId' })
  }
}

export default User
