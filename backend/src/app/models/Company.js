import Sequelize, { Model } from 'sequelize'
import bcrypt from 'bcryptjs'

class Company extends Model {
  static init (sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        passwordHash: Sequelize.STRING
      },
      {
        sequelize
      }
    )

    this.addHook('beforeSave', async company => {
      if (company.password) {
        company.passwordHash = await bcrypt.hash(company.password, 8)
      }
    })

    return this
  }

  checkPassword (password) {
    return bcrypt.compare(password, this.passwordHash)
  }
}

export default Company
