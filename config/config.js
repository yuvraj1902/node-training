const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
console.log(path.resolve(__dirname, '../.env'));
module.exports = {
  "development": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DATABASE,
    "host": process.env.DB_HOST,
    "port":process.env.DB_PORT,
    "dialect": "postgres",
    "define": {
      "underscored": true,
      "createdAt": "created_at",
      "updatedAt": "updated_at",
      "deletedAt": "deleted_at"
    }
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
