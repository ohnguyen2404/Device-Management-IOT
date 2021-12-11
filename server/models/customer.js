const {v4: uuidv4} = require('uuid')

module.exports = (sequelize, Sequelize) => {
  const Customer = sequelize.define('customer', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true
    },
    tenant_id: {
      type: Sequelize.UUID,
      references: {
        model: 'tenant',
        key: 'id'
      }
    },
    user_id: {
      type: Sequelize.UUID,
      allowNull: true
    },
    email: {
      type: Sequelize.STRING
    },
    title: {
      type: Sequelize.STRING
    },
    address: {
      type: Sequelize.STRING
    },
    phone: {
      type: Sequelize.STRING
    },
    country: {
      type: Sequelize.STRING
    },
    city: {
      type: Sequelize.STRING
    },
    state: {
      type: Sequelize.STRING
    },
    deleted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    created_uid: {
      type: Sequelize.UUID
    },
    update_uid: {
      type: Sequelize.UUID
    }
  }, {
    underscored: true,
    freezeTableName: true
  });

  Customer.beforeCreate(customer => customer.id = uuidv4())

  return Customer;
};