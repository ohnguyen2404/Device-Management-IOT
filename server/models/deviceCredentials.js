const {v4: uuidv4} = require('uuid')

module.exports = (sequelize, Sequelize) => {
  const DeviceCredentials = sequelize.define('device_credentials', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true
    },
    deviceId: {
      type: Sequelize.UUID,
      references: {
        model: 'device',
        key: 'id'
      },
      unique: true
    },
    credentialsType: {
      type: Sequelize.STRING
    },
    credentialsId: {
      type: Sequelize.STRING,
      unique: true
    },
    credentialsValue: {
      type: Sequelize.STRING,
      unique: true
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

  DeviceCredentials.beforeCreate(deviceCredentials => deviceCredentials.id = uuidv4())
  return DeviceCredentials;
};