

import { AccountModel } from "../model/accountModel.js"
import { NotificationModel } from "../model/notifications.js"

import https from 'https'
import fs from 'fs'
import { Server } from "socket.io";
import { failedReq, successReq } from "./utility.js";
import { TransactionModel } from "../model/transactionModel.js";
import { sendMailNoti } from "./verifyController.js";

const io = new Server({
  cors:{
      origin:"*",
    },
    
  
});

io.listen(8080)
io.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});
io.on('connect',async (socket) => {

  socket.on("join_room", async(data)=>{
    console.log(data,"join connect")
    if(!data) return
    if(data=="undefined"||data=="false"||data=="null") return
    const user = await AccountModel.findById(data)
    console.log(data,"join the room")
    if(!user){
      socket.join("unauthorized")
    }else{
      console.log(data,"join the room")
      socket.join(data)
    
    }
  })
 
  socket.on("create_transaction",(data)=>{
      console.log(data)
      socket.to(data).emit("new_noti",{action:"new_noti"})
  })


 
  socket.on('disconnect', () => {
    console.log(`1 left `)
    console.log('a user disconnect');
  })
  });
 

 
 
export const createTransactionNoti = async (req,id) =>{
  try {
   
      const {status,vendor,customer} = req.body
      const user = await AccountModel.findOne({_id:req.user.id})
    const noti = await new NotificationModel({
      message:`created a new order !`,
      vendor:vendor,
      customer:customer,
      transaction:id,
      sender:"customer"
    })
    await noti.save()

    await sendMailNoti(vendor,"customer")
    return
  } catch (error) {
      return console.log(error)
  }
}
export const updateTransactionNoti = async (req,id,sender) =>{
  try {
    let {transactionID} =req.query
      const {updateStatus} = req.body
      const transaction = await TransactionModel.findOne({_id:transactionID})
    const noti = await new NotificationModel({
      message:` changed to ${updateStatus}!`,
      vendor:transaction.vendor,
      customer:transaction.customer,
      transaction:id,
      sender:sender
    })
    await noti.save()
    if(sender=="customer"){
      await sendMailNoti(transaction.vendor,sender)
    }else{
      await sendMailNoti(transaction.customer,sender)
    }
    return
  } catch (error) {
      return console.log(error)
  }
}

export const getAllNotiFicaton = async (req,res) =>{
  try {
    
          const {id , role} = req.user
          if(role=="vendor"){

            const noties = await NotificationModel.find({vendor:id}).populate({ path:"transaction",populate:{
              path:"service_id",
              select:"image"
            }}).populate("customer","name").sort({$natural:-1})
            return successReq(200,noties,res)
          }
          if(role!="vendor"){
            
            const noties = await NotificationModel.find({customer:id}).populate({ path:"transaction",populate:{
              path:"service_id",
              select:"image"
            }}).populate("vendor","name").sort({$natural:-1})
            return successReq(200,noties,res)
          }
  } catch (error) {
      console.log(error)
      return failedReq(500,error,res)
  }



}