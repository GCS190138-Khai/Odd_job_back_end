import express from 'express'
import path from 'path';
const __dirname = path.resolve();
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import dotenv  from "dotenv"
import fs from 'fs'

import account from './route/accountRoute.js'
import admin from './route/admin_type_management.js'
import service_job from './route/serviceJobRoute.js'
 import transaction from './route/transaction.js'




const app= express();
const PORT =  8000


dotenv.config();
//CONECT DATABASE
app.listen(PORT,()=>{
    console.log("server is running")
})
mongoose.connect("mongodb+srv://odd_job:123@cluster0.krrhbzs.mongodb.net/?retryWrites=true&w=majority",
{ useNewUrlParser:true, useUnifiedTopology:true,
}).then(()=>{
    console.log("Connected")

}).catch(err =>{
    console.log('err',err)
})

app.disable('etag');

app.use(bodyParser.json({limit:"10mb"}));
app.use(bodyParser.urlencoded({extended:true,limit:"10mb"    }));
app.use(cors());
app.use(morgan("common"));
app.use(cookieParser())
app.use(express.json())
app.use('/uploads/', express.static('uploads/'));
app.use("/api/account",account)
app.use("/api/admin_management",admin)
app.use("/api/serive_job",service_job)
app.use("/api/transaction",transaction)
