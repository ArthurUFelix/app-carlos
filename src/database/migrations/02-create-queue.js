'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('Queues', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      companyId: {
        type: Sequelize.INTEGER,
        references: { model: 'Companies', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: true
      },
      ingressCode: {
        type: Sequelize.STRING,
        allowNull: false
      },
      observation: {
        type: Sequelize.STRING,
        allowNull: false
      },
      startTime: {
        type: Sequelize.DATE,
        allowNull: false
      },
      endTime: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    })
  },

  down: async (queryInterface) => {
    return queryInterface.dropTable('Queues')
  }
}
