const {v4: uuidv4} = require('uuid')

module.exports = (sequelize, Sequelize) => {
  const widgetsBundle = sequelize.define('widgets_bundle', {
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
    alias: {
      type: Sequelize.STRING,
      unique: true
    },
    image: {
      type: Sequelize.STRING(10000)
    },
    description: {
      type: Sequelize.STRING,
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

  widgetsBundle.beforeCreate(bundle => bundle.id = uuidv4())
  return widgetsBundle;
};