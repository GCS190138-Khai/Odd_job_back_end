import mongoose from "mongoose";


const schema = new mongoose.Schema({

 
 
status:{
type:String,
enum:["Unreaded","Readed"],
default:"Unreaded"
},
 message:{
  type:String,

 },
vendor:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"Account",
  required:true
},
customer: {
  type:mongoose.Schema.Types.ObjectId,
  ref:"Account",
  required:true
},
transaction:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"Transaction",
  required:true
},
sender:{
type:String
}



},{timestamps:true})
export const  NotificationModel = mongoose.model("notification",schema)