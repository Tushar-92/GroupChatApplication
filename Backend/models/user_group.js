const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const GroupChatAppUsers = require('./users');
const Groups = require('./groups');


const user_group = sequelize.define('user_group' , 
  {},
  { timestamps: false }
);


module.exports = user_group;