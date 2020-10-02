import express from 'express'
import grainchainController from '../controllers/grainchain-controller'
import { validate, addContractValidator, updateContractValidator } from '../middlewares/validator'
import { isAuth } from '../middlewares/auth'

const router = express.Router()

router.post('/createContract', isAuth, addContractValidator(), validate, grainchainController.createContract)
router.get('/getContract/:id', isAuth, grainchainController.getContract)
router.put('/updateContractStatus', isAuth, updateContractValidator(), validate, grainchainController.putContractStatus)


export default router
