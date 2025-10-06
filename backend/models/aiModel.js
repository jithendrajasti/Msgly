const mongoose=require('mongoose');

const aiSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    prompt:{
        type:String,
        required:true
    },
    response:{
        type:String,
        required:true
    }
},{
    timestamps:true
});

const Ai=mongoose.model("ai",aiSchema);

module.exports=Ai;