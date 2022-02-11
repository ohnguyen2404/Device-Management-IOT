//const fs = require('fs');
//const path = require('path');
const Sequelize = require("sequelize")
//const basename = path.basename(module.filename);
const env = process.env.NODE_ENV || "development"
const config = require(`${__dirname}/../config/dbconfig.js`)[env]

const db = {}

let sequelize
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable])
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config)
}

db.sequelize = sequelize
db.Sequelize = Sequelize

db.Tenant = require("./tenant")(sequelize, Sequelize)
db.Customer = require("./customer")(sequelize, Sequelize)
db.Device = require("./device")(sequelize, Sequelize)
db.DeviceCredentials = require("./deviceCredentials")(sequelize, Sequelize)
db.WidgetsBundle = require("./widgetsBundle")(sequelize, Sequelize)
db.WidgetType = require("./widgetType")(sequelize, Sequelize)
db.Dashboard = require("./dashboard")(sequelize, Sequelize)
db.CustomerDevice = require("./customerDevice")(sequelize, Sequelize)
db.TenantDevice = require("./tenantDevice")(sequelize, Sequelize)
db.Alarm = require("./alarm")(sequelize, Sequelize)

db.Tenant.hasMany(db.Device, {foreignKey: "tenantId"})
db.Tenant.hasMany(db.Customer, {foreignKey: "tenantId"})
db.Tenant.hasMany(db.WidgetsBundle, {foreignKey: "tenantId"})
db.Tenant.hasMany(db.WidgetType, {foreignKey: "tenantId"})
db.Tenant.hasMany(db.Dashboard, {foreignKey: "tenantId"})

db.Customer.belongsTo(db.Tenant, {foreignKey: "tenantId"})

db.Device.belongsTo(db.Tenant, {foreignKey: "tenantId"})

db.DeviceCredentials.belongsTo(db.Device, {
    foreignKey: "deviceId",
    as: "deviceCredentials",
})
db.Device.hasOne(db.DeviceCredentials, {
    foreignKey: "deviceId",
    as: "deviceCredentials",
})

db.WidgetsBundle.belongsTo(db.Tenant, {foreignKey: "tenantId"})
db.WidgetType.belongsTo(db.Tenant, {foreignKey: "tenantId"})

db.Dashboard.belongsTo(db.Tenant, {foreignKey: "tenantId"})

db.CustomerDevice.belongsTo(db.Customer, {foreignKey: "customerId"})
db.CustomerDevice.belongsTo(db.Device, {foreignKey: "deviceId"})

db.TenantDevice.belongsTo(db.Tenant, {foreignKey: "tenantId"})
db.TenantDevice.belongsTo(db.Device, {foreignKey: "deviceId"})

db.Alarm.belongsTo(db.Device, {foreignKey: "deviceId"})
module.exports = db
