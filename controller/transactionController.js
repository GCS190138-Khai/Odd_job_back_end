import { TransactionModel } from "../model/transactionModel.js"
import { createTransactionNoti,updateTransactionNoti } from "./notification.js"
import { failedReq, noDataModel, successReq } from "./utility.js"


export const createTrasaction = async (req,res) =>{
  try {
    
    const {  }= req.body
    
    const trans = await  new TransactionModel({
        customer:req.user,
        ...req.body
    })

    await trans.save()

    await createTransactionNoti(req,trans._id)
    
    successReq(200,"success",res)

  } catch (error) {
    console.log(error)
    return failedReq(500,error,res)
  }
}

export const getTransaction = async (req,res) =>{

  try {
    const { role,id}    = req.user
    let {status} =req.query
    if(status=="none"||!status){
      if(role=="vendor"){
        const transactions = await TransactionModel.find({vendor:id  }).populate("customer",{name:1,phone:1,address:1,email:1}).populate("service_id")
        if(transactions.length==0)  return successReq(200,noDataModel,res)
        return successReq(200,transactions,res)
      } 
      if(role!="vendor"){
        const transactions = await TransactionModel.find({customer:id }).populate("vendor",{name:1,phone:1,address:1,email:1}).populate("service_id")
        if(transactions.length==0)  return successReq(200,noDataModel,res)
        return successReq(200,transactions,res)
      }
    }else{

      if(role=="vendor"){
        const transactions = await TransactionModel.find({vendor:id ,transaction_status:status}).populate("customer",{name:1,phone:1,address:1,email:1}).populate("service_id")
        if(transactions.length==0)  return successReq(200,noDataModel,res)
        return successReq(200,transactions,res)
      } 
      if(role!="vendor"){
        const transactions = await TransactionModel.find({customer:id ,transaction_status:status}).populate("vendor",{name:1,phone:1,address:1,email:1}).populate("service_id")
        if(transactions.length==0)  return successReq(200,noDataModel,res)
        return successReq(200,transactions,res)
      }
    }

  } catch (error) {
      console.log(error)
      return failedReq(500,error,res)
  }
}
export const getOneTransaction = async (req,res) =>{

  try {
    const { role,id}    = req.user
    let {transactionID} =req.query


      if(role=="vendor"){
        const transactions = await TransactionModel.findOne({vendor:id ,_id:transactionID}).populate("customer",{name:1,phone:1,address:1,email:1}).populate("service_id")
        if(transactions.length==0)  return successReq(200,noDataModel,res)
        return successReq(200,transactions,res)
      } 
      if(role!="vendor"){
        const transactions = await TransactionModel.findOne({customer:id ,_id: transactionID}).populate("vendor",{name:1,phone:1,address:1,email:1}).populate("service_id")
        if(transactions.length==0)  return successReq(200,noDataModel,res)
        return successReq(200,transactions,res)
      }
 

  } catch (error) {
      console.log(error)
      return failedReq(500,error,res)
  }
}
// enum:['Pending Confirmation','Standby','Handling','Completed','Canceled'],
export const updateOneTransaction = async (req,res) =>{

  try {
    const { role,id}    = req.user
    let {transactionID} =req.query
    let { updateStatus } = req.body

        if(!transactionID) return failedReq(405,"Transaction not found !")
        const transaction = await TransactionModel.findById(transactionID)
        if(!transaction) return failedReq(500,"Transaction not found !")
      if(role=="vendor"){
        if(transaction.transaction_status=="Completed"||transaction.transaction_status=="Canceled") return failedReq(400,`This transaction is ${transaction.transaction_status} !`)
        const transactions = await TransactionModel.findByIdAndUpdate(transactionID,{ $set:{transaction_status:updateStatus}})
        await  updateTransactionNoti(req,transaction._id,"vendor")
        return successReq(200,transactions,res)
      } 
      if(role!="vendor"){
        if(transaction.transaction_status=="Completed"||transaction.transaction_status=="Canceled"||transaction.transaction_status=="Handling") return failedReq(400,`This transaction is ${transaction.transaction_status} !`)
        const transactions = await TransactionModel.findByIdAndUpdate(transactionID,{ $set:{transaction_status:updateStatus}})
        await  updateTransactionNoti(req,transaction._id,"customer")
        return successReq(200,transactions,res)
      }
 

  } catch (error) {
      console.log(error)
      return failedReq(500,error,res)
  }
}