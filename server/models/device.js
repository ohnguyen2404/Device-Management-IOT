const {v4: uuidv4} = require('uuid')

module.exports = (sequelize, Sequelize) => {
  const Device = sequelize.define('device', {
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
    customer_id: {
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

  Device.beforeCreate(device => device.id = uuidv4())
  return Device;
};