const {v4: uuidv4} = require('uuid')

module.exports = (sequelize, Sequelize) => {
  const Tenant = sequelize.define('tenant', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true
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

  Tenant.beforeCreate(tenant => tenant.id = uuidv4())

  return Tenant;
};