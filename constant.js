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
  TOKEN_HEADER: "Authorization"
}