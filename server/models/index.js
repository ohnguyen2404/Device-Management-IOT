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

db.User.belongsToMany(db.Role, {
  through: 'user_role'
})

db.Role.belongsToMany(db.User, {
  through: 'user_role'
});


module.exports = db;