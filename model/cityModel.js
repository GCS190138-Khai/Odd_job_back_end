import mongoose from "mongoose";


const schema = new mongoose.Schema({

 name:{
  type:String
 },
 code:{
  type:Number
 },
 codename:{
  type:String
 },
 phone_code:{
  type:Number
 },
 districts:{
  type:mongoose.Schema.Types.Mixed,
 
 }
})




export const CityModel = mongoose.model("city",schema)