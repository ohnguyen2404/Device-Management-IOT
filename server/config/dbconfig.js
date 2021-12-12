require('dotenv').config();
const constants = require('../../constant')

module.exports = {
  "development": {
    "username": constants.DATABASE_USERNAME,
    "password": constants.DATABASE_PASSWORD,
    "database": constants.DATABASE_NAME,
    "host": constants.DATABASE_HOST,
    "port": constants.DATABASE_PORT,  
    "dialect": constants.DATABASE_DIALECT
  },
  "test": {
    "username": constants.DATABASE_USERNAME,
    "password": constants.DATABASE_PASSWORD,
    "database": constants.DATABASE_NAME,
    "host": constants.DATABASE_HOST,
    "port": constants.DATABASE_PORT,  
    "dialect": constants.DATABASE_DIALECT
  },
  "production": {
    "username": constants.DATABASE_USERNAME,
    "password": constants.DATABASE_PASSWORD,
    "database": constants.DATABASE_NAME,
    "host": constants.DATABASE_HOST,
    "port": constants.DATABASE_PORT,  
    "dialect": constants.DATABASE_DIALECT
  }
}
