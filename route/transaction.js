import express from "express";
import {   verifyTokenCustomer, verifyTokenQuery } from "../controller/middlewareController.js";
import { createTrasaction, getOneTransaction, getTransaction, updateOneTransaction } from "../controller/transactionController.js";



const router = express.Router()

router.post('/create',verifyTokenCustomer,createTrasaction)
router.get('/all_transactions',verifyTokenQuery,getTransaction)
router.get('/get_one',verifyTokenQuery,getOneTransaction)
router.post('/update_one',verifyTokenQuery,updateOneTransaction)
export default router