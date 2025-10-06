const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = async (userId, res) => {
    try {
        const payload={userId};
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("jwt", token, {
          httpOnly: true,
          secure:true,
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return token;
      } catch (err) {
        console.error("JWT error:", err.message);
        res.status(500).json({ message: "Token generation failed" });
      }
}

module.exports={generateToken};
