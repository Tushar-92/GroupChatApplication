//Requireing npm here
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./util/database');
const GroupChatAppUsers = require('./models/users');
const StoredChats = require('./models/chats');
const Groups = require('./models/groups');
const user_group = require('./models/user_group');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();


//Configuring our app after requiring above npm
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


//All routes goes here
const userRouter = require('./routes/user');
app.use('/user' , userRouter);

//Making Associations Here
GroupChatAppUsers.hasMany(StoredChats);
StoredChats.belongsTo(GroupChatAppUsers);

Groups.hasMany(StoredChats);
StoredChats.belongsTo(Groups);

GroupChatAppUsers.belongsToMany(Groups, { through: user_group });
Groups.belongsToMany(GroupChatAppUsers, { through: user_group });



//Synchronizing our database here
sequelize.sync()
    .then(result => {
        console.log(result);
        app.listen(process.env.PORT || 3000);
    })
    .catch(err => {
        console.log(err);
    }); 
