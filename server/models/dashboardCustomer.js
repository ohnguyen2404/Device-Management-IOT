const {v4: uuidv4} = require('uuid')

module.exports = (sequelize, Sequelize) => {
  const DashboardCustomer = sequelize.define('dashboard_customer', {
    dashboardId: {
      type: Sequelize.UUID,
      references: {
        model: 'dashboard',
        key: 'id'
      },
      unique: "uniqueCompositeKey"
    },
    customerId: {
      type: Sequelize.UUID,
      references: {
        model: 'customer',
        key: 'id'
      },
      unique: "uniqueCompositeKey"
    },
  }, {
    underscored: true,
    freezeTableName: true,
  });

  DashboardCustomer.beforeCreate(dc => dc.id = uuidv4())
  DashboardCustomer.removeAttribute('id')
  DashboardCustomer.removeAttribute('createdAt')
  DashboardCustomer.removeAttribute('updatedAt')
  
  return DashboardCustomer;
};