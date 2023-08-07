const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const authenticateMiddleware = require('../middleware/auth');

router.post('/signup' , userController.userSignUp);

// router.post('/login' , authenticateMiddleware.authenticate, userController.userLogin ); //since login me sirf pasword match kar k user ko uska token dena so abhi authenticate wale middleware ki koi use nahi
router.post('/login' , userController.userLogin );

router.post('/message', authenticateMiddleware.authenticate , userController.storeNewMessageFromUser);

router.get('/message/:newButtonid' , userController.getStoredChatsFromDatabase);

router.get('/message/lastMessageId/:newButtonid' , userController.getLastMessageIdFromDatabase);

router.post('/createGroup' , userController.createNewGroup );

router.get('/getgroups' , userController.getGroups);

router.get('/getGroupId' , userController.getGroupId);

router.get('/isUserjoinedThisGroup/:newButtonid', authenticateMiddleware.authenticate , userController.isUserjoinedThisGroup);

router.post('/createEntryInJunction' , authenticateMiddleware.authenticate , userController.createRecordInJunctionTable);



module.exports = router;