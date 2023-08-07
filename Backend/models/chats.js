
const Sequelize = require('sequelize');
const sequelize = require('../util/database');


const Chats = sequelize.define('Chats' , {

      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },

      Name: {
        type: Sequelize.STRING ,
        allowNull: false
      },
    
      Message: {
        type: Sequelize.STRING ,
        allowNull: false
      }
    
});


module.exports = Chats;