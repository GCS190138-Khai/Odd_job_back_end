import mongoose from "mongoose";


const schema = new mongoose.Schema({

  email:{
    type:String,
    minlength:6,
    maxlength:30,
    // required:[true,"Email is missing !"]
  },
  password:{
    type:String,
    required:true
   
  },
  phone:{
    type:Number,
    minlength:8,
    maxlength:20,
    unique:true
  },
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
  },
  role:{
    type:String,
    enum:['admin','vendor','customer','moderator','worker'],
    default:'customer'
  },
  status:{
    type:String,
    enum:['Activated','Suspended','Deleted','Deactivated'],
    default:'Deactivated'
  },
  
  transaction_history:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Transaction"
  }],
  
},{timestamps:true})
export const AccountModel = mongoose.model("Account",schema)