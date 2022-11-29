import express from "express";

import { verifyTokenAdmin, verifyTokenVendor } from "../controller/middlewareController.js";
import { createServiceJob, getOneServiceJob, getOneServiceJobAndRand, getRandomServiceJob, getRandomServiceJobQuery, getServiceJob, updateServiceJob } from "../controller/service_jobController.js";
import {  uploadImage, uploadProduct } from "../controller/utility.js";

const router = express.Router()

router.post('/',verifyTokenVendor,uploadImage,createServiceJob)
router.get('/',verifyTokenVendor,getServiceJob)
router.get('/findOneSerivce',getOneServiceJob)
router.post('/update',verifyTokenVendor,uploadImage,updateServiceJob)
router.get('/random_service_job',getRandomServiceJob)
router.get('/random_service_job_vendor',getOneServiceJobAndRand)
router.get('/serive_query',getRandomServiceJobQuery)
export default router