import { AccountModel } from "../model/accountModel.js"
import { TokenModel } from "../model/tokenModel.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv  from "dotenv"
import nodemailer from 'nodemailer'
import { failedReq, generateToken, successReq } from "./utility.js"
import { RePassModel } from "../model/re_passwordModel.js"
dotenv.config()

const gmailPass="jgbv mdfa qnmt fmfd"
export const sendVerify = async (req,res)=>{
  try {
    const {email} = req.body
    if(!email) return res.status(500).json("Invalid email")

   const user = await AccountModel.findOne({"email":email})
   if(!user)return res.status(500).json("User not found")
   if(user.role!="customer") return res.status(500).json("Only allow the customer !")
   const token = await TokenModel.findOne({owner: user._id})
   if(token)return res.status(500).json("Verify link has been sent to your email, please check your inbox !")
   const salt = await bcrypt.genSalt(10)
      const thisT =  generateToken(40)
   const t = await bcrypt.hash(thisT ,salt)

  
   const verifyToken = await  new  TokenModel({owner:user._id,token:t})

      await verifyToken.save()
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'edwardpham22102001@gmail.com',
            pass: gmailPass
        }
    });
    
    const options = {

        to: email,
        subject: "security",
        html: `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>forgot password</title>
        </head>
        <body>
        <h1>CLick the link below to verify your account</h1>
        <a href="https://bioklaw.tech/account_verify?token=${thisT}&id=${user._id}">Click here!</a>
        </body>
        </html>`,

    }
  
    
      await transporter.sendMail(options)
      
    return console.log("success")
    } catch (error) {

      return console.log(error)
    }
}
export const sendMailNoti = async (id,sender)=>{
  try {
  
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'edwardpham22102001@gmail.com',
            pass: gmailPass
        }
    });
    
    if(sender=="customer"){
        const user = await AccountModel.findById(id)   
     const  options = {

          to: user.email,
          subject: "transaction",
          html: `<!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>forgot password</title>
          </head>
          <body>
          <h1>You have a now transaction notification !</h1>
          <a href="https://vendor.bioklaw.tech/vendor">View transactions!</a>
          </body>
          </html>`,
  
      }
      await transporter.sendMail(options)
      
      return console.log("success")
    }else{
      const user = await AccountModel.findById(id)   
    const  options = {

        to: user.email,
        subject: "transaction",
        html: `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>forgot password</title>
        </head>
        <body>
        <h1>You have a now transaction notification !</h1>
        <a href="https://bioklaw.tech/transaction">View your transactions!</a>
        </body>
        </html>`,

    }
    await transporter.sendMail(options)
      
    return console.log("success")
    }
    

  
    
    
    } catch (error) {

      return console.log(error)
    }
}

export const sendVerifyRe = async (req,res)=>{
  try {
    const {email} = req.body
    if(!email) return res.status(500).json("Invalid email")

   const user = await AccountModel.findOne({"email":email})
   if(!user)return res.status(500).json("User not found")
   if(user.role!="customer") return res.status(500).json("Only allow the customer !")
   if(user.status=="Activated"||user.status=="Suspended"||user.status=="Deleted") return res.status(500).json("Forbiden !")
   const token = await TokenModel.findOne({owner: user._id})
   if(token)return res.status(500).json("Verify link has been sent to your email, please check your inbox !")
   const salt = await bcrypt.genSalt(10)
      const thisT = generateToken(40)
   const t = await bcrypt.hash(thisT ,salt)

  
   const verifyToken = await new TokenModel({owner:user._id,token:t})

      await verifyToken.save()
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'edwardpham22102001@gmail.com',
            pass: gmailPass
        }
    });
    
    const options = {

        to: email,
        subject: "security",
        html: `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>forgot password</title>
        </head>
        <body>
        <h1>CLick the link below to verify your account</h1>
        <a href="https://bioklaw.tech/account_verify?token=${thisT}&id=${user._id}">Click here!</a>
        </body>
        </html>`,

    }
  
    
      await transporter.sendMail(options)
      successReq(200,"success",res)
    return console.log("success")
    } catch (error) {
      console.log(error)
      return failedReq(500,error,res)
    }
}
export const verifyTokenFirst = async (req,res )=>{
  try {
    const {id ,token} = req.query
    
    if(!id||!token) return res.status(500).json("Invalid request")
    
 

   const user = await AccountModel.findOne({"_id":id},{ password:0})
   if(!user)return res.status(500).json("User not found !")
   if(!user.status==="Deactivated") return res.status(500).json("User has been actived !")
   if(user.role !=="customer")  return res.status(500).json("Only allow customer !")
   const dbtoken = await TokenModel.findOne({owner: user._id})
   if(!dbtoken) return res.status(500).json("Token not found verify failed, please try again !")  
 
    const salt = await bcrypt.genSalt(10)
    const thisT = token
 const t = await bcrypt.hash(thisT ,salt)
    if(!t===dbtoken.token)  return res.status(500).json("Not valid token !")

      const active = await AccountModel.findByIdAndUpdate(user._id,{status:"Activated"},{new:true})
      await TokenModel.findByIdAndDelete(dbtoken._id)
    return res.status(200).json(active)
      
    } catch (error) {
      return res.status(500).json(error)
    }
}
//--------------------------Re_Pass

export const sendRePass = async (req,res)=>{
  try {
    const {email} = req.body
    if(!email) return res.status(500).json("Invalid email")

   const user = await AccountModel.findOne({"email":email})
   if(!user)return res.status(500).json("User not found")
   
   const token = await RePassModel.findOne({owner: user._id})
   if(token)return res.status(500).json("Verify link has been sent to your email, please check your inbox !")
   const salt = await bcrypt.genSalt(10)
      const thisT =  generateToken(40)
   const t = await bcrypt.hash(thisT ,salt)

  
   const verifyToken = await  new  RePassModel({owner:user._id,token:t})

      await verifyToken.save()
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'edwardpham22102001@gmail.com',
            pass: gmailPass
        }
    });
    
    const options = {

        to: email,
        subject: "security",
        html: `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>forgot password</title>
        </head>
        <body>
        <h1>Click on the link below to retrive your password !</h1>
        <a href="https://bioklaw.tech/re_password_check?token=${thisT}&id=${user._id}">Click here!</a>
        </body>
        </html>`,

    }
  
    
      await transporter.sendMail(options)
      
    return  successReq(200,"Your re-password has been sent to your email inbox, please check yout email !",res)
    } catch (error) {
      console.log(error)
      return failedReq(500,error,res)
    }
}
export const verifyTokenRePass = async (req,res )=>{
  try {
    const {id ,token} = req.query
    const {password} = req.body
    if(!id||!token) return res.status(500).json("Invalid request")
    
 

   const user = await AccountModel.findOne({"_id":id},{ password:0})
   if(!user)return res.status(500).json("User not found !")
   if(!user.status==="Deactivated") return res.status(500).json("User has been actived !")
   
   const dbtoken = await RePassModel.findOne({owner: user._id})
   if(!dbtoken) return res.status(500).json("Token not found verify failed, please try again !")  
 
    const salt = await bcrypt.genSalt(10)
    const thisT = token
 const t = await bcrypt.hash(thisT ,salt)
    if(!t===dbtoken.token)  return res.status(500).json("Not valid token !")

    const salt2 = await bcrypt.genSalt(5)
    const hashed = await bcrypt.hash(password,salt2)
      await    AccountModel.findByIdAndUpdate(user._id,{ $set: {password:hashed}})
      await RePassModel.findByIdAndDelete(dbtoken._id)
    return res.status(200).json("You has successfully changed your password !")
      
    } catch (error) {
      return res.status(500).json(error)
    }
}