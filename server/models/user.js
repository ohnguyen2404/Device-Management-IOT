const {v4: uuidv4} = require('uuid')

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('user', {
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
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    first_name: {
      type: Sequelize.STRING
    },
    last_name: {
      type: Sequelize.STRING
    },
    authority: {
      type: Sequelize.STRING(10)
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

  User.beforeCreate(user => user.id = uuidv4())

  return User;
};