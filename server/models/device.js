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
    device_data: {
      type: Sequelize.JSON
    },
    type: {
      type: Sequelize.STRING
    },
    name: {
      type: Sequelize.STRING
    },
    label: {
      type: Sequelize.STRING
    },
    firmware_id: {
      type: Sequelize.UUID
    },
    software_id: {
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
    freezeTableName: true
  });

  Device.beforeCreate(device => device.id = uuidv4())
  return Device;
};