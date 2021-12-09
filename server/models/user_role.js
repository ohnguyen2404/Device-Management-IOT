const compositeUniqueKey = 'userId_roleId'

module.exports = (sequelize, Sequelize) => {
  const User_Role = sequelize.define('user_role', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
  }, {freezeTableName: true});

  return User_Role;
};