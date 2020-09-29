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
exports.default = router;
