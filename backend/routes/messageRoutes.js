const express=require('express');
const { protectRoute } = require('../middlewares/authMiddleware');
const {getUsersForSidebar, getMessages, sendMessages, askAi, getAi, searchByEmail}=require('../controllers/messageControllers');

const messageRouter=express.Router();

messageRouter.get('/users',protectRoute,getUsersForSidebar);
messageRouter.get('/get-msg/:id',protectRoute,getMessages);
messageRouter.post('/send-msg/:id',protectRoute,sendMessages);
messageRouter.post('/askAi',protectRoute,askAi);
messageRouter.get('/getAi',protectRoute,getAi);
messageRouter.post('/search',protectRoute,searchByEmail);
module.exports=messageRouter;