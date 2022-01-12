const {v4: uuidv4} = require('uuid')

module.exports = (sequelize, Sequelize) => {
  const WidgetType = sequelize.define('widget_type', {
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
    name: {
      type: Sequelize.STRING
    },
    alias: {
      type: Sequelize.STRING,
      unique: true
    },
    bundleAlias: {
      type: Sequelize.STRING
    },
    image: {
      type: Sequelize.STRING(10000)
    },
    description: {
      type: Sequelize.STRING,
    },
    descriptor: {
      type: Sequelize.STRING(1000000)
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

  WidgetType.beforeCreate(widget => widget.id = uuidv4())
  return WidgetType;
};