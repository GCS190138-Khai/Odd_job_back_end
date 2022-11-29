import mongoose from "mongoose";


const schema = new mongoose.Schema({
  vendor_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Account",
    required:true
  },
  status: {
    type:String,
    enum: ['Pending','Approved','Rejected'],
    default:"Pending"
  },
  vendor_address: {
    city:{
      type:String
    },
    district:{
      type:String
    },
    ward:{
      type:String
    },
    street:{
      type:String
    }

  },
  
  service_type:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"ServiceType",
   
  }]
  ,
  business_desc: {
    type:mongoose.Schema.Types.Mixed,
  },
  NumberID: {
    type: Number,
      required:true
  },
  
  TaxNumber: {
    type: Number,
      required:true
  },
  front_image: {
    type:mongoose.Schema.Types.ObjectId,
    ref:"Image",
    required:true
  },
  back_image: {
    type:mongoose.Schema.Types.ObjectId,
    ref:"Image",
    required:true
  },



  

},{timestamps:true})



export const VendorFormModel = mongoose.model("VendorForm",schema)