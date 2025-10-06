const express = require('express');
const { login, signup, logout, updateProfile, checkAuth, resetPass } = require('../controllers/authControllers');
const {protectRoute}=require('../middlewares/authMiddleware');
const authRouter = express.Router();

authRouter.get('/', (req, res) => {
    res.send("this is authRouter");
})
authRouter.post('/login', login);
authRouter.post('/signup', signup);
authRouter.post('/logout', logout);
authRouter.put("/update-profile",protectRoute,updateProfile);
authRouter.get("/check",protectRoute,checkAuth);
authRouter.post("/reset-pass",resetPass);
module.exports = { authRouter };