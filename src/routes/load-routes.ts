import express from 'express'
import { validate, addLoadToContractValidator } from '../middlewares/validator'
import { isAuth } from '../middlewares/auth'
import loadController from '../controllers/load-controller'


const router = express.Router()

router.post('/addLoadToContract', isAuth, addLoadToContractValidator(), validate, loadController.addLoad)
router.get('/getLoad/:contractId/:loadId', isAuth, loadController.getLoad)


export default router
