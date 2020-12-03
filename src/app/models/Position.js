import Sequelize, { Model } from 'sequelize'

class Position extends Model {
  static init (sequelize) {
    super.init(
      {
        first: Sequelize.BOOLEAN
      },
      {
        sequelize
      }
    )

    return this
  }

  static associate (models) {
    this.belongsTo(models.Queue, { foreignKey: 'queueId' })
    this.belongsTo(models.Position, { foreignKey: 'next' })
    this.belongsTo(models.User, { foreignKey: 'userId' })
  }
}

export default Position
