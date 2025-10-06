const mongoose=require('mongoose');
require('dotenv').config();
exports.connectDB=async()=>{
    try {
       const connection= await mongoose.connect(process.env.MONGODB_URL);
       console.log(`MongoDb connected: ${connection.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1); //1 means failure
    }
}