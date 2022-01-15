const {v4: uuidv4} = require('uuid')

module.exports = (sequelize, Sequelize) => {
  const Dashboard = sequelize.define('dashboard', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true
    },
    tenantId: {
      type: Sequelize.UUID,
      references: {
        model: 'tenant',
        key: 'id'
      }
    },
    title: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    assignedCustomers: {
      type: Sequelize.STRING(1000000)
    },
    image: {
      type: Sequelize.STRING
    },
    configuration: {
      type: Sequelize.STRING(1000000),
    },
    deleted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    createUid: {
      type: Sequelize.UUID
    },
    updateUid: {
      type: Sequelize.UUID
    }
  }, {
    underscored: true,
    freezeTableName: true,
    defaultScope: {
      attributes: {exclude: ['deleted', 'createUid', 'updateUid', 'createdAt', 'updatedAt']}
    }
  });

  Dashboard.beforeCreate(dashboard => dashboard.id = uuidv4())
  return Dashboard;
};