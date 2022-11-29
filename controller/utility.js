import { ReportTypeModel } from "../model/reportType.js"
import { ServiceTypeModel } from "../model/service_type.js"
import { createLogs } from "./logsController.js"
import path from 'path'
import multer from 'multer'
export const failedReq = (type,content,res)=>{
     return res.status(type).json(content)
}
export const successReq = (type,content,res)=>{
   return res.status(type).json(content)
}
export const createReportType = async (req,res)=>{
    try {
      const {name,authorID} = req.body
     
      const check = await ReportTypeModel.findOne({name:name})
    
      if(check) return failedReq(404,"Already have this one",res)
      const newType =  await new ReportTypeModel({name:name})

      await newType.save()
   
      await createLogs(`Create report type:${newType.name}`,null,"create",req.user.id,null)
      return successReq(200,newType,res)
      
    } catch (error) {
      return res.status(500).json(error)
    }


}
export const createServiceType = async (req,res)=>{
  try {
    const { type_name,description,image,admin_author} = req.body
    
    const check = await ServiceTypeModel.findOne({type_name:type_name})
  
    if(check) return failedReq(404,"Already have this one",res)
    const newType =  await new ServiceTypeModel({...req.body,image:`https://api.bioklaw.tech/${req.file.path}`,admin_author:req.user.id})

    await newType.save()
   
    await createLogs(`Create serive type:${newType.type_name}`,null,"create",req.user.id,null)
    return successReq(200,newType,res)
    
  } catch (error) {
    return res.status(500).json(error)
  }


}
export const noDataModel = [{
  _id:"no data",
  status:" no data "
}]
export const getAllServicesType = async (req,res)=>{
  try {
    const allTypes = await ServiceTypeModel.find().populate("admin_author","name role")
    return successReq(200,allTypes,res)
  } catch (error) {
    return failedReq(500,error,res)
  }
} 
export const getAllServicesTypeClient = async (req,res)=>{
  try {
    const allTypes = await ServiceTypeModel.find({},{ type_name:1,image:1,description:1})
    return successReq(200,{data:allTypes},res)
  } catch (error) {
    return failedReq(500,error,res)
  }
} 

export const deleteManyServicesType = async (req,res)=>{
  try {

    // objects=req.body.ids

    await ServiceTypeModel.deleteMany({_id: { $in: req.body.ids}})
   
     await createLogs(`Delete serive type:${"unknown"}`,"create","delete",req.user.id,null)
     return successReq(200,"deleted",res)
  } catch (error) {
    return failedReq(500,error,res)
  }
}


var storageProduct = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,'uploads')
  },
  filename: (req,file,cb)=>{
      // let ext = path.extname(file.originalname)
      cb(null, file.originalname)
  }
})
var storageID = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,'ID_Image')
  },
  filename: (req,file,cb)=>{
      // let ext = path.extname(file.originalname)
      cb(null, file.originalname)
  }
})
export const  uploadID = multer ({
  storage:storageID,
  fileFilter:(req,file,callback)=>{
    if(file.mimetype=="image/png"||
    file.mimetype=="image/jpg"||
    file.mimetype=="image/jpeg"){
      callback(null,true)
    }else{
      console.log('only png,jpg,jpeg')
      callback(null,false)
    }
  },
  limits:{
    fileSize: 1024*1024*5
  }
})
export const  uploadProduct = multer ({
  storage:storageProduct,
  fileFilter:(req,file,callback)=>{
    if(file.mimetype=="image/png"||
    file.mimetype=="image/jpg"||
    file.mimetype=="image/jpeg"){
      callback(null,true)
    }else{
      console.log('only png,jpg,jpeg')
      callback(null,false)
    }
  },
  limits:{
    fileSize: 1024*1024*5
  }
})
export const uploadImage =async (req,res,next)=>{
  try {
     
      const upload =     uploadProduct.single('image') 
       upload(req,res,(err)=>{
          if(err){
              return  res.status(500).json(err)
          }else{
 
            
            next()
              
          }
       })  
   
  } catch (error) {
      return  res.status(500).json(error)
  }
 
  
}
export function generateToken(length) {
  const rand=()=>Math.random(0).toString(36).substr(2);
  const  token=(length)=>(rand()+rand()+rand()+rand()).substr(0,length);
  const a = token(length)
  return a
}

export const action = {
  create:"created",
  update:"updated"
}

export const at ={
  vendorForm:"vender-form"
}

export const modelStatusFilter= async (req,model,populate,option) =>{
   
  let {status} = req.query
   
  if(!status||status=='none'){
    return await model.find({vendor_id:req.user.id},option).populate(
      {
        path:populate.path,
        select:populate.select
      }
    )
  }

  return await model.find({ $and: [
    {vendor_id:req.user.id},
    req.query
]},option ).populate(   {
  path:populate.path,
  select:populate.select
})




}