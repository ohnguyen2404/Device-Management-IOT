require('dotenv').config();

module.exports = {
  // Database
  DATABASE_USERNAME: process.env.DB_USERNAME,
  DATABASE_PASSWORD: process.env.DB_PASSWORD,
  DATABASE_NAME: process.env.DB_NAME,
  DATABASE_HOST: process.env.DB_HOST,
  DATABASE_PORT: process.env.DB_PORT,  
  DATABASE_DIALECT: process.env.DB_DIALECT,

  // Token header
  TOKEN_HEADER: "Authorization",
  TOKEN_START: "Bearer ",

  // API URL
  IOT_CORE_URL: process.env.IOT_CORE_URL,

  // ROLES
  AUTHORITIES: [
    'ADMIN',
    'TENANT',
    'CUSTOMER'
  ],

  // DEVICE_CREDENTIALS
  DEVICE_CREDENTIALS_TYPE_ACCESS_TOKEN: "ACCESS_TOKEN",
  DEVICE_CREDENTIALS_TYPE_X_509: "X509_CERTIFICATE",
  DEVICE_CREDENTIALS_TYPE_MQTT_BASIC: "MQTT_BASIC",
}