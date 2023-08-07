const Sequelize = require('sequelize');
const sequelize = require('../util/database');


const Groups = sequelize.define('Groups' , {

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
    
      Admin: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },

          
});


module.exports = Groups;