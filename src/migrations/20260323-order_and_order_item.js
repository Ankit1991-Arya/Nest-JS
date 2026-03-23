await queryInterface.createTable('orders', {
  id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
  userId: Sequelize.INTEGER,
  totalAmount: Sequelize.FLOAT,
  status: Sequelize.STRING,
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE
});

await queryInterface.createTable('order_items', {
  id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
  orderId: Sequelize.INTEGER,
  productId: Sequelize.INTEGER,
  quantity: Sequelize.INTEGER,
  price: Sequelize.FLOAT,
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE
});