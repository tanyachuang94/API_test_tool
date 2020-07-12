require('dotenv').config();
const mysql = require('mysql');

var db = mysql.createPool({
  connectionLimit : 5,
  host            : process.env.HOST,
  user            : process.env.USERNAME,
  password        : process.env.PASSWORD,
  database        : process.env.DATABASE,
})

module.exports= db