import { Sequelize } from 'sequelize'
import Sequelize, { Model } from 'sequelize'

class Queue extends Model {
    static init(sequelize) {
        super.init(
            {
                ingress_code: Sequelize.STRING,
                observation: Sequelize.STRING,
                start_time: Sequelize.DATE,
                end_time: Sequelize.DATE
            },
            {
                sequelize
            }
        )

        return this
    }

    static associate(models) {
        this.belongsTo(models.Company, { foreignKey: 'company_id', as: 'company' })
    }
}

export default Queue
