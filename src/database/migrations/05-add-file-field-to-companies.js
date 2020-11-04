'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Companies',
      'fileId',
      {
        type: Sequelize.INTEGER,
        references: { model: 'Files', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true
      })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('companies', 'fileId')
  }
}
