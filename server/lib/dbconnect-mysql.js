const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'atpldhaka.com',
  user: 'atpldhaka_autoattendance',
  password: 'atpldhaka_autoattendance',
  database: 'atpldhaka_autoattendance',
});

module.exports = pool; 
