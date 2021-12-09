module.exports = (sequelize, Sequelize) => {
  const Role = sequelize.define('role', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    underscored: true,
    freezeTableName: true
  });

  Role.defaultRoles = ['USER', 'ADMIN']

  Role.initial = () => {
    Role.defaultRoles.forEach((role) => {
      Role.findOrCreate({
        where: {name: role},
        logging: false
      })
    })
  }
  
  return Role;
};