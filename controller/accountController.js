import { AccountModel } from "../model/accountModel.js"
import fs from 'fs'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { action, at, failedReq, successReq, uploadID } from "./utility.js"

import { ImageModel } from "../model/imageModel.js"
import { VendorFormModel } from "../model/vendorFormModel.js"
 
import { sendVerify } from "./verifyController.js"
 
import { RTModel } from "../model/RT_Model.js"

export const createAccount = async (req,res) =>{
  try {
    const newAcc = req.body
 
    const checkEmail = await AccountModel.findOne({email:newAcc.email})
    if(checkEmail) return failedReq(400,`${newAcc.email} is already used !`,res)
    const checkPhone = await AccountModel.findOne({phone:newAcc.phone})
    if(checkPhone) return failedReq(400,`${newAcc.phone} is already used !`,res)
    const checkName = await AccountModel.findOne({name:newAcc.name})
    if(checkName) return failedReq(400,`${newAcc.name} is already used !`,res)
    const salt = await bcrypt.genSalt(5)
    const hashed = await bcrypt.hash(newAcc.password,salt)
    const account = await  new  AccountModel({...newAcc,password:hashed})
    await account.save()
    const { password,  ...others } = account._doc;
    if(newAcc.role=='customer'){

      await sendVerify(req,res)
    }
    return res.status(200).json(others)
  } catch (error) {
    console.log(error)
    return res.status(500).json(error)
  }
}


export const getByIdAcc = async (req,res) =>{
  try {
       
      const  finder = req.params
      if(!finder) return  res.status(404).json('not found')
    
  
      const accounts = await AccountModel.findById(finder.user_id,{password:0})
      
    

      return res.status(200).json({user:accounts})

  } catch (error) {
      return res.status(500).json(error)
  }

}
export const getAllAccount = async (req,res) =>{
  try {
      const user = req.body
      if(user.role=='customer'||user.role=='vendor'){
        return res.status(403).json('You not allow to do this')
      }
      if(user.role=='admin'||user.role=='moderator'){
        const accounts = await AccountModel.find()
        return res.status(200).json(accounts)
      }

      return res.status(404).json('not found')

  } catch (error) {
      return res.status(500).json(error)
  }

}
export const updateAccount = async (req,res) =>{
  try {


    const newAcc = req.body

    const account = await    AccountModel.findByIdAndUpdate(newAcc._id,newAcc)
 
    return res.status(200).json(account)
  } catch (error) {
    return res.status(500).json(error)
  }
}
export const loginUser= async (req,res)=>{

  try { 
      
      const  user = await AccountModel.findOne({email:req.body.email})
      if(!user){
          return res.status(404).send("*User not found !")
      }
      const validPassword = await bcrypt.compare(
          req.body.password,
          user.password
      )
      if(!validPassword){
          return res.status(404).send("*User or password not valid")
          
      }
      if(user&&validPassword){  
         const accessToken= generateAccessToken(user)
          const refreshToken= await generateLoginRefreshToken(user)
          const {password,...others}= user._doc;
          return res.status(200).json({user:{...others,accessToken,refreshToken}})
      }
      



  } catch (error) {
      return res.status(500).json(error)
  }
}
export const loginAdmin= async (req,res)=>{

  try { 
      
      const  user = await AccountModel.findOne({email:req.body.email})
      if(!user){
          return res.status(404).send("*User not found !")
      }
     
      if(user.role!='moderator'&&user.role!='admin') return failedReq(403,"forbiden",res)
     
      const validPassword = await bcrypt.compare(
          req.body.password,
          user.password
      )
      if(!validPassword){
          return res.status(404).send("*User or password not valid")
          
      }
      if(user&&validPassword){
          
         const accessToken= generateAccessToken(user)
     
     
          const refreshToken= await generateLoginRefreshToken(user)
          

           
          const {password,...others}= user._doc;
        
          return res.status(200).json({user:{...others,accessToken,refreshToken}})
      }
      



  } catch (error) {
      return res.status(500).json(error)
  }
}
export const loginVendor= async (req,res)=>{

  try { 
      
      const  user = await AccountModel.findOne({email:req.body.email})
      if(!user){
          return res.status(404).send("*User not found !")
      }
       
      if(user.role!='vendor') return failedReq(403,"Only for vendor",res)
     
      const validPassword = await bcrypt.compare(
          req.body.password,
          user.password
      )
      if(!validPassword){
          return res.status(404).send("*User or password not valid")
          
      }
      if(user&&validPassword){
          
         const accessToken= generateAccessToken(user)
     
     
          const refreshToken= await generateLoginRefreshToken(user)
          

           
          const {password,...others}= user._doc;
        
          return res.status(200).json({user:{...others,accessToken,refreshToken}})
      }
      



  } catch (error) {
      return res.status(500).json(error)
  }
}
export const loginOut= async (req,res)=>{

  try { 
      
       const  user = await AccountModel.findOne({email:req.body.email})
     await RTModel.findOneAndDelete({token:req.body.refreshToken})
      if(!user){
          return res.status(404).send({message:"*User not found !"})
      }
      res.status(200).json('Log out !')
  } catch (error) {
      return res.status(500).json(error)
  }
}

export const generateAccessToken=  (user)=>{

  return jwt.sign({
   id: user.id,
   role: user.role
},
process.env.JWT_ACCESS_KEY,
{expiresIn:"30s"}
)
}

export const generateLoginRefreshToken= async  (user,req)=>{
  const RT =  jwt.sign({
    id: user.id,
    admin: user.role
 },
 process.env.JWT_REFRESH_KEY,
 {expiresIn:"365d"} 
 )
 
    try {
 
      const newRT = await new RTModel({ token:RT,owner:user._id})
      await newRT.save()
     return RT
    } catch (error) {
      return  console.log(error)
    } 

 
  
}
export const generateRefreshToken= async  (user,req)=>{
  const RT =  jwt.sign({
    id: user.id,
    admin: user.role
 },
 process.env.JWT_REFRESH_KEY,
 {expiresIn:"365d"} 
 )
 
    try {
      await RTModel.findOneAndDelete({ token:req.token })
      const newRT = await new RTModel({ token:RT,owner:user._id})
      await newRT.save()
     return RT
    } catch (error) {
      console.log(error)
    } 

 
  
}
export const refreshToken = async (req,res) =>{
  try {

      const { id } = req.user
      const user = await AccountModel.findById(id,{password:0})
      if(!user) return failedReq(400,"User not found !",res)
      const accessToken= generateAccessToken(user)
      const refreshToken= await generateRefreshToken(user,req)
      const thisUser = await user._doc;
      return  res.status(200).json({user:{...thisUser,accessToken,refreshToken}})

  } catch (error) {
    
  }
}
export const createVendorForm = async (req,res)=>{
  try {
    

   

      if(!req.files.front_image ) return failedReq(400,"missing front id image",res)
      if(!req.files.back_image ) return failedReq(400,"missing back id image",res)
      const front_image = await new ImageModel({
        name:req.files.front_image[0].filename,
        img:{
            data: fs.readFileSync(`ID_Image/${req.files.front_image[0].filename}`),
            contentType:req.files.front_image[0].mimetype
        }
    })
      const back_image = await new ImageModel({
        name:req.files.back_image[0].filename,
        img:{
            data: fs.readFileSync(`ID_Image/${req.files.back_image[0].filename}`),
            contentType:req.files.back_image[0].mimetype
        }
    })

    
    const venderForm = await new VendorFormModel({
      vendor_id:req.user.id,
      vendor_address:{
        city:req.body.city,
        district:req.body.district,
        ward:req.body.ward,
        street:req.body.street
      },
      business_desc:req.body.business_desc,
      NumberID:req.body.NumberID,
      TaxNumber:req.body.TaxNumber,
      front_image:front_image._id,
      back_image: back_image._id,
      service_type:req.body.service_type.split(",")
  
    })
    await front_image.save()
    await back_image.save()
    await venderForm.save()




      successReq(200,venderForm,res)

  } catch (error) {
    console.log(error)
    return failedReq(500,error,res)
  }
}

export const findVendorForm = async (req,res) =>{
  try {
    const { id} = req.query
     
    if(!id) return failedReq(400,"Bad request",res)
      const vendorForm = await VendorFormModel.findById(id).populate("front_image").populate("back_image")
    if(!vendorForm) return failedReq(404,"Vendorform not found",res)
      return successReq(200,vendorForm,res)

  } catch (error) {
    console.log(error)
    return failedReq(500,error,res)
  }
}

