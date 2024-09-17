const {Sequelize} = require('sequelize');
require('dotenv').config();

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    logging: false
  });
  

db.authenticate()
    .then(() => {
        console.log('Connection has been established successfully to database.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

    db.sync({ alter: true, force: true });

module.exports = db;