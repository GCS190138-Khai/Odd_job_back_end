

import { ServiceModel } from "../model/service_job.js"
import { VendorFormModel } from "../model/vendorFormModel.js"
import { failedReq, modelStatusFilter, noDataModel, successReq } from "./utility.js"
import { createLogs } from "./logsController.js"
import { AccountModel } from "../model/accountModel.js"
import mongoose from "mongoose"
export const createServiceJob= async (req,res)=>{
  try {
    const newJob = await new ServiceModel({...req.body,vendor_id:req.user.id,image:`https://api.bioklaw.tech/${req.file.path}`})
    await newJob.save()
    return successReq(200,newJob,res)
  } catch (error) {
    return failedReq(500,error,res)
  }
}
export const getServiceJob= async (req,res)=>{
  try {
   
  
        const  allJob =    await  modelStatusFilter(req,ServiceModel,{path:"type",select:"type_name"},{vendor_id:0})
 
      if(allJob.length==0){
        return successReq(200,noDataModel,res)
      }
    return successReq(200,allJob,res)
  } catch (error) {
    console.log(error)
    return failedReq(500,error,res)
  }
}
export const getRandomServiceJob= async (req,res)=>{
  try {
   
  
        const  allJob =    await  ServiceModel.aggregate(
          [
              { $match: { status: "on" } },
              { $sample: { size: 20 } } 
          ]
      )
          await ServiceModel
          .populate(allJob,[{path:"vendor_id" ,select:"name phone email status"},{path:"type",select:"type_name"}])
          
          
    return successReq(200,allJob,res)
  } catch (error) {
    console.log(error)
    return failedReq(500,error,res)
  }
}
export const getRandomServiceJobQuery= async (req,res)=>{
  try {
   
    const  { serviceTypeID,price,keyword} = req.query

  //   if(keyword){
  //     const  allJob =    await  ServiceModel.aggregate(
  //       [
  //           {$search:{
  //             "index":"searchServices",
  //             "text":{
  //               "query":keyword,
  //               "path" :["service_name","address.city","address.district","address.ward","address.street"]
  //             }
  //           }},
  //           {$match: {
  //             $and: [ 
  //                 {status: "on"}, 
  //                 {type: new mongoose.Types.ObjectId("636613f3b53c18427077b73c")}, 
                  
  //             ]
  //        }},
  //           { $sample: { size: 20 } } 
  //       ]
  //   ).sort({price:price})
  //       await ServiceModel
  //       .populate(allJob,[{path:"vendor_id" ,select:"name phone email status"},{path:"type",select:"type_name"}])
        
        
  // return successReq(200,allJob,res)
  //   }
   
        const  allJob =    await  ServiceModel.aggregate(
          [
              // {$search:{
              //   "index":"searchServices",
              //   "text":{
              //     "query":keyword,
              //     "path" :["service_name","address.city","address.district","address.ward","address.street"]
              //   }
              // }},
              {$match: {
                $and: [ 
                    {status: "on"}, 
                    {type: new mongoose.Types.ObjectId(serviceTypeID)}, 
                    
                ]
           }},
              { $sample: { size: 20 } } 
          ]
      ).sort({price:price})
          await ServiceModel
          .populate(allJob,[{path:"vendor_id" ,select:"name phone email status"},{path:"type",select:"type_name"}])
          
         if(allJob.length==0) return successReq(200,noDataModel,res)
    return successReq(200,allJob,res)
  } catch (error) {
    console.log(error)
    return failedReq(500,error,res)
  }
}

export const updateServiceJob = async (req,res) =>{
  try {
      const { serviceID }  = req.query
      
    const newJob = await ServiceModel.findByIdAndUpdate(serviceID,{
      $set:{
        ...req.body,
        
         address:{
         city: req.body.city,
         district: req.body.district,
         ward:req.body.ward,
         street:req.body.street
         },

        image: req.file? `https://api.bioklaw.tech/${req.file.path}` : req.body.image
      }
    })
    return successReq(200,"success",res)
  } catch (error) {
    console.log(error)
    return failedReq(500,error,res)
  }
}
export const getOneServiceJob= async (req,res)=>{
  try {
   
          const { service_ID } = req.query
          if(!service_ID )   return failedReq(401,"Service not found",res)
        const service =    await  ServiceModel.findById(service_ID ).populate("type",{type_name:1}).populate("vendor_id",{password:0})

      
     
    return successReq(200,service,res)
  } catch (error) {
    console.log(error)
    return failedReq(500,error,res)
  }
}
export const getOneServiceJobAndRand= async (req,res)=>{
  try {
   
          const { service_ID } = req.query
          if(!service_ID )   return failedReq(401,"Service not found",res)
        const service =    await  ServiceModel.findById(service_ID ).populate("type",{type_name:1}).populate("vendor_id",{password:0})
        const  allJob =    await  ServiceModel.aggregate(
          [
              { $match: { status: "on",vendor_id:service.vendor_id._id } },
              { $sample: { size: 2} } 
          ]
      )
          await ServiceModel
          .populate(allJob,[{path:"vendor_id" ,select:"name phone email status"},{path:"type",select:"type_name"}])
      
     
    return successReq(200,{service:service,rand:allJob},res)
  } catch (error) {
    console.log(error)
    return failedReq(500,error,res)
  }
}

export const getAllVendorForm = async (req,res) =>{
  try {
    let {   status } = req.query
  
    if(status=='none'||!status){
     const all = await VendorFormModel.find().populate("front_image").populate("back_image").populate("vendor_id",{name:1,phone:1,email:1}).populate("service_type",{type_name:1})
     if(all.length==0) {
      return successReq(200,noDataModel,res)
   }
     return successReq(200,all,res)
    }else{

     const  all = await VendorFormModel.find({status:status}).populate("front_image").populate("back_image").populate("vendor_id",{name:1,phone:1,email:1}).populate("service_type",{type_name:1})
      if(all.length==0) {
         return successReq(200,noDataModel,res)
      }

     return successReq(200,all,res)
    }
  
  } catch (error) {
    return failedReq(500,error,res)
  }
}
export const deleteManyVendorForm = async (req,res)=>{
  try {

    // objects=req.body.ids

    await VendorFormModel.deleteMany({_id: { $in: req.body.ids}})
   
     await createLogs(`Delete vendor form:${"unknown"}`,"create","delete",req.user.id,null)
     return successReq(200,"deleted",res)
  } catch (error) {
    console.log(error)
    return failedReq(500,error,res)
  }
}
export const updateManyVendorForm = async (req,res)=>{
  try {

    // objects=req.body.ids
 
     await VendorFormModel.updateMany({_id: { $in: req.body.ids}},{status:req.query.status},{new:true}) 

     const newVendor = await  VendorFormModel.find({_id: { $in: req.body.ids}})
     newVendor.map( async(item,i)=>{
      if(req.query.status==="Approved"){

        await AccountModel.findByIdAndUpdate(item.vendor_id,{status:"Activated"})
       await item.service_type.map( async(item2)=>{

          const newService =  await new ServiceModel({
            vendor_id:item.vendor_id,
             price:1,
             type:item2,
             service_name:"Unknown",
             description:"Unknown",
             image:"Unknown"
           })
           return await newService.save()
        })
      }
     return await createLogs(`Update vendor form:${item._id}`,"inactive","active",req.user.id,item.vendor_id)
    })

    const allVendorForm = await VendorFormModel.find()

     return successReq(200,allVendorForm,res)
  } catch (error) {
    console.log(error)
    return failedReq(500,error,res)
  }
}