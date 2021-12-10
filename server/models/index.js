//const fs = require('fs');
//const path = require('path');
const Sequelize = require('sequelize');
//const basename = path.basename(module.filename);
const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/../config/dbconfig.js`)[env];

const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable]);
} 
else {
  sequelize = new Sequelize(
    config.database, config.username, config.password, config
  );
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('../models/user')(sequelize, Sequelize);
db.Role = require('../models/role')(sequelize, Sequelize);
db.User_Role = require('../models/user_role')(sequelize, Sequelize);

db.Device = require('../models/device')(sequelize, Sequelize);
db.Customer = require('../models/customer')(sequelize, Sequelize);
db.Tenant = require('../models/tenant')(sequelize, Sequelize);

db.User.belongsToMany(db.Role, {
  through: 'user_role',
  foreignKey: 'user_id',
  otherKey: 'role_id'
})

db.Role.belongsToMany(db.User, {
  through: 'user_role',
  foreignKey: 'role_id',
  otherKey: 'user_id'
});

db.Tenant.hasMany(db.Device, {foreignKey: 'tenant_id'})
db.Tenant.hasMany(db.User, {foreignKey: 'tenant_id'})
db.Tenant.hasMany(db.Customer, {foreignKey: 'tenant_id'})

db.Customer.hasMany(db.Device, {foreignKey: 'customer_id'})
db.Customer.hasMany(db.User, {foreignKey: 'customer_id'})
db.Customer.belongsTo(db.Tenant, {foreignKey: 'tenant_id'})

db.Device.belongsTo(db.Tenant, {foreignKey: 'tenant_id'})
db.Device.belongsTo(db.Customer, {foreignKey: 'customer_id'})

db.User.belongsTo(db.Tenant, {foreignKey: 'tenant_id'})
db.User.belongsTo(db.Customer, {foreignKey: 'customer_id'})

module.exports = db;