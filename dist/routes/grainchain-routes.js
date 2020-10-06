"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const grainchain_controller_1 = __importDefault(require("../controllers/grainchain-controller"));
const validator_1 = require("../middlewares/validator");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.post('/createContract', auth_1.isAuth, validator_1.addContractValidator(), validator_1.validate, grainchain_controller_1.default.createContract);
router.get('/getContract/:id', auth_1.isAuth, grainchain_controller_1.default.getContract);
router.put('/addContractOwner', auth_1.isAuth, validator_1.updateOwnerValidator(), validator_1.validate, grainchain_controller_1.default.addContractOwner);
router.put('/addContractViewer', auth_1.isAuth, validator_1.updateViewerValidator(), validator_1.validate, grainchain_controller_1.default.addContractViewer);
router.put('/updateContractStatus', auth_1.isAuth, validator_1.updateContractValidator(), validator_1.validate, grainchain_controller_1.default.putContractStatus);
router.delete('/deleteContractViewer', auth_1.isAuth, validator_1.deleteViewerValidator(), validator_1.validate, grainchain_controller_1.default.deleteContractViewer);
router.delete('/deleteContractOwner', auth_1.isAuth, validator_1.deleteOwnerValidator(), validator_1.validate, grainchain_controller_1.default.deleteContractOwner);
exports.default = router;
