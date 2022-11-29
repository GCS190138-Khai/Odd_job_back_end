import express from "express";
import { createAccount, createVendorForm, findVendorForm, getAllAccount, getByIdAcc, loginAdmin, loginOut, loginUser, loginVendor, refreshToken } from "../controller/accountController.js";
import { verifyRefreshToken, verifyToken, verifyTokenParams, verifyTokenQuery, verifyTokenVendor, verifyTokenVendorForm } from "../controller/middlewareController.js";
import { getAllNotiFicaton } from "../controller/notification.js";
import { uploadID } from "../controller/utility.js";
import { sendRePass, sendVerifyRe, verifyTokenFirst, verifyTokenRePass } from "../controller/verifyController.js";
const router = express.Router()

router.post('/login',loginUser)
router.post('/login_admin',loginAdmin)
router.post('/login_vendor',loginVendor)
router.post('/logout',verifyToken,loginOut)
router.post('/',createAccount)
router.get('/verify_account',verifyTokenFirst)
router.post('/get_accounts',getAllAccount)
router.get('/get-one/:user_id',verifyTokenParams,getByIdAcc)
router.post('/vendor',verifyTokenVendorForm,uploadID.fields([{name:'front_image', maxCount:1},{name:'back_image', maxCount:1}]),createVendorForm)
router.get('/get_vendor_from',verifyTokenVendor,findVendorForm)
router.post("/activate_account",verifyToken,sendVerifyRe)
router.post('/refresh',verifyRefreshToken,refreshToken)
router.get('/noti',verifyTokenQuery,getAllNotiFicaton)
router.post('/re_password',sendRePass)
router.post('/re_password_check',verifyTokenRePass)
export default router