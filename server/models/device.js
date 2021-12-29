const {v4: uuidv4} = require('uuid')

module.exports = (sequelize, Sequelize) => {
  const Device = sequelize.define('device', {
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
    customerId: {
      type: Sequelize.UUID,
      references: {
        model: 'customer',
        key: 'id'
      }
    },
    deviceData: {
      type: Sequelize.JSON
    },
    type: {
      type: Sequelize.STRING
    },
    name: {
      type: Sequelize.STRING,
      unique: true
    },
    label: {
      type: Sequelize.STRING
    },
    firmwareId: {
      type: Sequelize.UUID
    },
    softwareId: {
      type: Sequelize.UUID
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

  Device.beforeCreate(device => device.id = uuidv4())
  return Device;
};