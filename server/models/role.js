module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });

  Role.associate = (models) => {
    Role.belongsToMany(models.User, {
      through: 'user_role',
      foreignKey: 'roleId',
    });
  };

  Role.defaultRoles = ['USER', 'ADMIN']

  return Role;
};