import jwt from 'jsonwebtoken'
import { AccountModel } from '../model/accountModel.js'
import { RTModel } from '../model/RT_Model.js'
import { VendorFormModel } from '../model/vendorFormModel.js'
import { failedReq } from './utility.js'


export const verifyToken= async (req,res,next)=>{
    const token = req.headers.token
    
    if(token){
        const accessToken= token.split(" ")[1]
     
        jwt.verify(accessToken,process.env.JWT_ACCESS_KEY,(err,user)=>{
            if(err){
              return  res.status(403).json("Token is not valid")
            }
            
            const isUserValid = user.id==req.body._id
            if(!isUserValid) return  res.status(403).json("You not allow to do this !")
            req.user = user;
            next()
        })
    }else{
        return res.status(401).json("You're not authenticated")  
    }
}
export const verifyRefreshToken= async (req,res,next)=>{
    const token = req.headers.token

    if(token){
        const refreshToken= token.split(" ")[1]
 
   
        jwt.verify(refreshToken,process.env.JWT_REFRESH_KEY, async (err,user)=>{
            if(err){
              return  res.status(403).json("Token is not valid")
            }
            const checkRF = await RTModel.findOne({owner:user.id})
            
            if(!checkRF) return failedReq(401,"Invalid token !",res)
            // const  check  = refreshToken==checkRF.token
            // if(!check){ 
            //     await RTModel.deleteMany({owner: { $in: user.id}})
            //     return failedReq(401,"This token wrong !",res)}
            const isUserValid = user.id==req.body._id
            if(!isUserValid) return  res.status(403).json("You not allow to do this !")
            req.user = user;
            req.token = refreshToken
            // await RTModel.findByIdAndDelete(checkRF._id)
            next()
        })
    }else{
        return res.status(401).json("You're not authenticated")  
    }
}
export const verifyTokenAdmin= async (req,res,next)=>{
    const token = req.headers.token
 
    try {
        if(token){
            const accessToken= token.split(" ")[1]
       
            jwt.verify(accessToken,process.env.JWT_ACCESS_KEY,(err,user)=>{
                if(err){
                    console.log(err)
                  return  res.status(403).json("Token is not valid")
                }
               
               
                if(user.role=="admin"){
                    
                    req.user = user;
                   next()
               
                }else if(user.role=="moderator"){
                    req.user = user;
               
                     next()
                }else{
                    return res.status(404).json("Forbidden")
                }
              
               
            })
        }else{
            return res.status(401).json("You're not authenticated")  
        }
    } catch (error) {
        return res.status(500).json(error)  
    }
  
}
export const verifyTokenVendor= async (req,res,next)=>{
    const token = req.headers.token
    try {
        if(token){
            const accessToken= token.split(" ")[1]
       
            jwt.verify(accessToken,process.env.JWT_ACCESS_KEY, async(err,user)=>{
                if(err){
                  return  res.status(403).json("Token is not valid")
                }
               
               
                if(user.role=="vendor"){
                    const vendor = await AccountModel.findById(user.id)
                    if(!vendor) return failedReq(404,"User not found !",res)
                    if(vendor.status=="Activated"){
                        req.user = user;
                        next()
                    }else{
                        return failedReq(403,`You are ${vendor.status}`,res)
                    }
                  
          
                }else{
                    return res.status(404).json("Forbidden")
                }
              
               
            })
        }else{
            return res.status(401).json("You're not authenticated")  
        }
    } catch (error) {
        return res.status(500).json(error)  
    }
  
}
export const verifyTokenVendorForm= async (req,res,next)=>{
    const token = req.headers.token
    try {
        if(token){
            const accessToken= token.split(" ")[1]
       
            jwt.verify(accessToken,process.env.JWT_ACCESS_KEY, async(err,user)=>{
                if(err){
                  return  res.status(403).json("Token is not valid")
                }
                if(user.id!=req.query.id) return  res.status(404).json("Forbidden")
               
                if(user.role=="vendor"){
                    const vendor = await AccountModel.findById(user.id)
                    const vendorForm = await VendorFormModel.find({vendor_id:user.id}).sort({$natural:-1})
                    if(vendorForm){

                        if(vendorForm.status=="Pending")  return failedReq(402,`You've already created a verifcation, your form is ${vendorForm.status} !`,res)
                    }
                    if(!vendor) return failedReq(404,"User not found !",res)
                    
                   
                        req.user = user;
                        next()
                 
                  
          
                }else{
                    return res.status(404).json("Forbidden")
                }
              
               
            })
        }else{
            return res.status(401).json("You're not authenticated")  
        }
    } catch (error) {
        return res.status(500).json(error)  
    }
  
}

export const verifyTokenCustomer= async (req,res,next)=>{
    const token = req.headers.token
    try {
        if(token){
            const accessToken= token.split(" ")[1]
       
            jwt.verify(accessToken,process.env.JWT_ACCESS_KEY, async(err,user)=>{
                if(err){
                  return  res.status(403).json("Token is not valid")
                }
               
               
                if(user.role!="vendor"){
                    const customer = await AccountModel.findById(user.id)
                    
                    if(!customer) return failedReq(404,"User not found !",res)
                    if(customer.status=="Activated"){
                        req.user = user;
                        next()
                    }else{
                        return failedReq(403,`You are ${customer.status}`,res)
                    }
                  
          
                }else{
                    return res.status(404).json("Forbidden")
                }
              
               
            })
        }else{
            return res.status(401).json("You're not authenticated")  
        }
    } catch (error) {
        return res.status(500).json(error)  
    }
  
}

export const verifyTokenParams= async (req,res,next)=>{
    const token = req.headers.token
    
    if(token){
        const accessToken= token.split(" ")[1]
     
        jwt.verify(accessToken,process.env.JWT_ACCESS_KEY,(err,user)=>{
            if(err){
              return  res.status(403).json("Token is not valid")
            }
            
            const isUserValid = user.id==req.params.user_id
            if(!isUserValid) return  res.status(403).json("You not allow to do this !")
            req.user = user;
            next()
        })
    }else{
        return res.status(401).json("You're not authenticated")  
    }
}


export const verifyTokenQuery= async (req,res,next)=>{
    const token = req.headers.token
    
    if(token){
        const accessToken= token.split(" ")[1]
     
        jwt.verify(accessToken,process.env.JWT_ACCESS_KEY,(err,user)=>{
            if(err){
              return  res.status(403).json("Token is not valid")
            }
            
            const isUserValid = user.id==req.query.id
            if(!isUserValid) return  res.status(403).json("You not allow to do this !")
            req.user = user;
            next()
        })
    }else{
        return res.status(401).json("You're not authenticated")  
    }
}
