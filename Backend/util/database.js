const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete' , 'root' , 'Tushar@21' , {
    dialect: 'mysql' ,
    host: 'localhost'
});

module.exports = sequelize;