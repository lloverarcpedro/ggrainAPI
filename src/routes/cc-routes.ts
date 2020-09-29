import express from 'express'
import { isAuth } from '../middlewares/auth'
import ccController from '../controllers/cc-controller'
import caController from '../controllers/ca-controller'

const router = express.Router()

router.post('/invokeCC', isAuth, ccController.invokeCC)
router.get('/queryCC',isAuth,ccController.queryCC)
router.get('/catest', caController.enrollAdmin)
router.get('/clearWallet',caController.clearWallet)
router.post('/enrollUser',caController.enrollUser)
router.post('/reenroll', caController.reenroll)

export default router