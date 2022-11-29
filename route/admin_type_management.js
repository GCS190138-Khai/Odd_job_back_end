import express from "express";

import { verifyTokenAdmin } from "../controller/middlewareController.js";
import { deleteManyVendorForm, getAllVendorForm, updateManyVendorForm } from "../controller/service_jobController.js";
import { createReportType, createServiceType, deleteManyServicesType, getAllServicesType, getAllServicesTypeClient, uploadImage } from "../controller/utility.js";

const router = express.Router()

router.post('/create_report_type',verifyTokenAdmin,createReportType)
router.post('/create_service_type',verifyTokenAdmin,uploadImage,createServiceType)
router.get('/get_all_service_type',verifyTokenAdmin,getAllServicesType)
router.delete('/get_delete_many_serive_type',verifyTokenAdmin,deleteManyServicesType)
router.get('/get_all_service_type_client',getAllServicesTypeClient)
router.get('/vendor_form',verifyTokenAdmin,getAllVendorForm)
router.delete('/vendor_form_delete',verifyTokenAdmin,deleteManyVendorForm)
router.put('/vendor_form_update',verifyTokenAdmin,updateManyVendorForm)
export default router