
const GroupChatAppUsers = require('../models/users');
const StoredChats = require('../models/chats');
const Groups =  require('../models/groups');
const user_group = require('../models/user_group');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Sequelize, Op } = require("sequelize");



//Through this function we are are going to check if string is empty or null
function isStringValid (str) {
    if(str === null || str.trim() === "") {
        return true;
    } else {
        return false;
    }
} 


async function userSignUp(req, res) {
    
    try {

        let incomingName =  req.body.name;
        let incomingEmail =  req.body.email;
        let incomingPhone = req.body.phone;
        let incomingPassword =  req.body.password;

               
        //Now lets validate that incoming data coming from the form is valid i.e not null or empty
        if(isStringValid(incomingName) || isStringValid(incomingEmail) || isStringValid(incomingPassword)) {
            return res.status(400).json({error : 'Bad parameters. Something is missing'});
        }


        //lets check if email id is already exists or not
        const result = await GroupChatAppUsers.findAll({where: {Email: incomingEmail}});
        if (result.length !=0) {
            return res.status(409).json({message: 'Email Id Already Exists'});
        }


        //now lets start encrypting the password
        const saltrounds = 10;

        bcrypt.hash(incomingPassword, saltrounds, async(error , hash) => {
            
            console.log(error);
            
            await GroupChatAppUsers.create({
                Name: incomingName,
                Email: incomingEmail,
                Phone: incomingPhone,
                Password: hash
            });
            
            console.log('User Created');
            return res.status(201).json({message: 'Successfully Created New User'});
        
        })

    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    } 
}


function generateAccessToken (id) {
    return jwt.sign({ userId: id} , process.env.TOKEN_SECRET);
}


async function userLogin(req, res) {

    try {
        
        let incomingEmail =  req.body.email;
        let incomingPassword =  req.body.password;
        
        //Now lets validate that incoming data coming from the form is valid i.e not null or empty
        if(isStringValid(incomingEmail) || isStringValid(incomingPassword)) {
            return res.status(400).json({message : 'Email ID or Password is missing'});
        }

        let user = await GroupChatAppUsers.findAll({ where: {Email: incomingEmail} });
        
        if(user.length > 0) {

            bcrypt.compare(incomingPassword , user[0].Password , (err, result) => {
                if(err) {
                    throw new Error('Something went wrong');
                }
                
                if(result === true) {
                    return res.status(200).json({message: 'User logged in successfully' , token: generateAccessToken(user[0].id)});
                } else {
                    return res.status(401).json({message: 'Password is Incorrect'});
                }
            })
            
        } else {
            return res.status(404).json({message: 'User Does Not Exists'});
        }
        
    
    } catch (err) {
        console.log(err);
        res.status(500).json({message: `${err}`});
    }

}


async function storeNewMessageFromUser (req , res) {

    try {
        let incomingMessage = req.body.message;
        let incomingGroupId = req.body.groupId;

        const result = await StoredChats.create({
        Message: incomingMessage,
        Name: req.user.Name,
        GroupChatAppUserId: req.user.id,
        GroupId: incomingGroupId
        })

        console.log('Message Created in Database');
        res.status(201).json(result);
        
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
        
    }
    
}

async function getLastMessageIdFromDatabase(req, res) {
    
    try {
        const result = await StoredChats.findAll({
            
            where: { GroupId : req.params.newButtonid },
            attributes: [Sequelize.fn('MAX', Sequelize.col('id'))],
            raw: true
        });

        console.log(result);
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}


async function getStoredChatsFromDatabase(req, res) {
    
    try {
        
        let messageIdFromWhereChatsTobeFetched = ((req.query.lastMessageId) - 9);
        console.log(messageIdFromWhereChatsTobeFetched);
        if(messageIdFromWhereChatsTobeFetched <= 0) messageIdFromWhereChatsTobeFetched=1;
        console.log(messageIdFromWhereChatsTobeFetched);
        
        const result = await StoredChats.findAll({
            // where: { GroupId : req.params.newButtonid },
            limit: 10,
            where: { id : { [Op.gte]: messageIdFromWhereChatsTobeFetched } , GroupId : req.params.newButtonid },
        });
        res.status(200).json(result);    
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
    
}



async function createNewGroup(req, res) {
    try {
       
        const result = await Groups.create({
            Name: req.body.Name,
            Admin: req.body.Admin
        })

        console.log('Group Created in Database');
        res.status(201).json(result);

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}


async function getGroups(req, res) {
    
    try {
        
        const result = await Groups.findAll();
        res.status(200).json(result);    
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
    
}


async function getGroupId(req, res) {
    try {
        const groupId = await User.findOne({
            where: { Name: req.body.groupName },
          });
        res.status(200).json(groupId);
        
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}


async function isUserjoinedThisGroup(req, res) {
    try {
        const result = await user_group.findAll({
            where: {GroupId: req.params.newButtonid , GroupChatAppUserId: req.user.id}
        });

        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}



async function createRecordInJunctionTable(req , res) {

    try {
        
        const result = await user_group.create({
            GroupChatAppUserId: req.user.id,
            GroupId: req.body.GroupId
        })

        console.log('Record Created in Junction Table');
        res.status(201).json(result);
        
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
        
    }
    
}




    

module.exports = {
    userSignUp,
    userLogin,
    storeNewMessageFromUser,
    getStoredChatsFromDatabase,
    getLastMessageIdFromDatabase,
    createNewGroup,
    getGroups,
    getGroupId,
    isUserjoinedThisGroup,
    createRecordInJunctionTable
}