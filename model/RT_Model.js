import mongoose from "mongoose";


const schema = new mongoose.Schema({

  token :{
    type:String,
    required:true
  },
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Account",
 
  },
createdAt :{
  type:Date,
  expires:"366d",
  default:Date.now()
}


})




export const RTModel = mongoose.model("RTModel",schema)