import mongoose from "mongoose";


const schema = new mongoose.Schema({
  vendor:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Account"
  },
  customer:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Account"
  },
  phone:{
    type:String,
  },
  name:{
    type:String,
  },
  service_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Service"
  },
  //job_address
  address: {
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
  transaction_status:{
    type:String,
    enum:['Pending Confirmation','Standby','Handling','Completed','Canceled'],
    default:"Pending Confirmation"
  },

  geoGraph:{
    lng:{
      type:String,
      
    },
    lat:{
      type:String,
     
    }
  }
  ,

  feedback_from_vendor:{
    type:String,
  },
  feedback_from_customer:{
      type:String,
  }




},{timestamps:true})
export const TransactionModel = mongoose.model("Transaction",schema)