//const fs = require('fs');
//const path = require('path');
const Sequelize = require("sequelize");
//const basename = path.basename(module.filename);
const env = process.env.NODE_ENV || "development";
const config = require(`${__dirname}/../config/dbconfig.js`)[env];

const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Customer = require("./customer")(sequelize, Sequelize);
db.Tenant = require("./tenant")(sequelize, Sequelize);
db.Device = require("./device")(sequelize, Sequelize);
db.DeviceCredentials = require("./deviceCredentials")(sequelize, Sequelize);
db.WidgetBundle = require("./widgetBundle")(sequelize, Sequelize);
db.WidgetType = require("./widgetType")(sequelize, Sequelize);

db.Tenant.hasMany(db.Device, { foreignKey: "tenantId" });
db.Tenant.hasMany(db.Customer, { foreignKey: "tenantId" });
db.Tenant.hasMany(db.WidgetBundle, { foreignKey: "tenantId" });
db.Tenant.hasMany(db.WidgetType, { foreignKey: "tenantId" });

db.Customer.hasMany(db.Device, { foreignKey: "customerId" });
db.Customer.belongsTo(db.Tenant, { foreignKey: "tenantId" });

db.Device.belongsTo(db.Tenant, { foreignKey: "tenantId" });
db.Device.belongsTo(db.Customer, { foreignKey: "customerId" });

db.DeviceCredentials.belongsTo(db.Device, {
  foreignKey: "deviceId",
  as: "deviceCredentials",
});
db.Device.hasOne(db.DeviceCredentials, {
  foreignKey: "deviceId",
  as: "deviceCredentials",
});

db.WidgetBundle.belongsTo(db.Tenant, { foreignKey: "tenantId" });
db.WidgetType.belongsTo(db.Tenant, { foreignKey: "tenantId" });


module.exports = db;
