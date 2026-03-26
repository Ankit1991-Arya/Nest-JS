'use strict';
const bcrypt = require('bcrypt');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const salt = await bcrypt.genSalt(10);
    const pass = await bcrypt.hash('password', salt);
    return queryInterface.bulkInsert('users', [
      { name: 'Admin User', email: 'admin@example.com', age: 30, password: pass, role: 'admin', createdAt: new Date(), updatedAt: new Date() }
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};
