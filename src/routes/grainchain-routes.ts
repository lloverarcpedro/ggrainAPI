import express from 'express'
import grainchainController from '../controllers/grainchain-controller'
import { validate, addContractValidator, updateContractValidator, updateOwnerValidator, updateViewerValidator, deleteOwnerValidator, deleteViewerValidator} from '../middlewares/validator'
import { isAuth } from '../middlewares/auth'

const router = express.Router()

router.post('/createContract', isAuth, addContractValidator(), validate, grainchainController.createContract)
router.get('/getContract/:id', isAuth, grainchainController.getContract)
router.put('/addContractOwner', isAuth, updateOwnerValidator(), validate, grainchainController.addContractOwner)
router.put('/addContractViewer', isAuth, updateViewerValidator(), validate, grainchainController.addContractViewer)
router.put('/updateContractStatus', isAuth, updateContractValidator(), validate, grainchainController.putContractStatus)
router.delete('/deleteContractViewer', isAuth, deleteViewerValidator(), validate, grainchainController.deleteContractViewer)
router.delete('/deleteContractOwner', isAuth, deleteOwnerValidator(), validate, grainchainController.deleteContractOwner)

export default router
