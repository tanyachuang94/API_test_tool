require('dotenv').config();
const mysql = require('mysql');

const env = process.env.NODE_ENV;
const {
  HOST, USERNAME, PASSWORD, DATABASE, DATABASE_TEST,
} = process.env;

const mysqlConfig = {
  production: { // for EC2 machine
    host: HOST,
    user: USERNAME,
    password: PASSWORD,
    database: DATABASE,
  },
  test: { // for automation testing (command: npm run test)
    host: HOST,
    user: USERNAME,
    password: PASSWORD,
    database: DATABASE_TEST,
  },
};

const db = mysql.createPool(mysqlConfig[env], { connectionLimit: 5 });

module.exports = db;
