import Sequelize, { Model } from 'sequelize'

class Queue extends Model {
  static init (sequelize) {
    super.init(
      {
        ingressCode: Sequelize.STRING,
        observation: Sequelize.STRING,
        startTime: Sequelize.DATE,
        endTime: Sequelize.DATE
      },
      {
        sequelize
      }
    )

    return this
  }

  static associate (models) {
    this.belongsTo(models.Company, { foreignKey: 'companyId' })
  }
}

export default Queue
