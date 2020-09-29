"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validator_1 = require("../middlewares/validator");
const auth_1 = require("../middlewares/auth");
const load_controller_1 = __importDefault(require("../controllers/load-controller"));
const router = express_1.default.Router();
router.post('/addLoadToContract', auth_1.isAuth, validator_1.addLoadToContractValidator(), validator_1.validate, load_controller_1.default.addLoad);
router.get('/getLoad/:contractId/:loadId', auth_1.isAuth, load_controller_1.default.getLoad);
exports.default = router;
