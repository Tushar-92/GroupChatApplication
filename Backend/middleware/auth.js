
const jwt = require('jsonwebtoken');
const GroupChatAppUsers = require('../models/users');

async function authenticate (req , res , next) {
    try {
        const token = req.header('Authorization');
        console.log(token);
        const user = jwt.verify(token , process.env.TOKEN_SECRET); //jo waha se encrypt kiye the wahi yaha pe decrypt kar rahe. Yaha se hume ek user object mil jaega jisme ki userId bhi hai i.e jo pass kiye the token banane k liye :)
        console.log('userID is -----> ', user.userId);

        let result = await GroupChatAppUsers.findByPk(user.userId);
        req.user = result;
        next();
    

    } catch (error) {
        console.log(error);
        return res.status(401).json({message: 'Error in Generating Token'});
    }
}



module.exports = {
    authenticate
}