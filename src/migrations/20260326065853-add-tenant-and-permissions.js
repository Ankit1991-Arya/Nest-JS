'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'tenantId', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('users', 'permissions', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: '[]',
    });

    await queryInterface.addColumn('products', 'tenantId', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'default',
    });

    await queryInterface.addColumn('orders', 'tenantId', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'default',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'tenantId');
    await queryInterface.removeColumn('users', 'permissions');
    await queryInterface.removeColumn('products', 'tenantId');
    await queryInterface.removeColumn('orders', 'tenantId');
  }
};
