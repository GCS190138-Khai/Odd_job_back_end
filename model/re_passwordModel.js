import mongoose from "mongoose";


const schema = new mongoose.Schema({
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
  },
  token :{
    type:String,
    required:true
  },

createdAt :{
  type:Date,
  expires:3600,
  default:Date.now()
}


})




export const RePassModel = mongoose.model("RePassModel",schema)