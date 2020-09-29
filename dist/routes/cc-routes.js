"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const cc_controller_1 = __importDefault(require("../controllers/cc-controller"));
const ca_controller_1 = __importDefault(require("../controllers/ca-controller"));
const router = express_1.default.Router();
router.post('/invokeCC', auth_1.isAuth, cc_controller_1.default.invokeCC);
router.get('/queryCC', auth_1.isAuth, cc_controller_1.default.queryCC);
router.get('/catest', ca_controller_1.default.enrollAdmin);
router.get('/clearWallet', ca_controller_1.default.clearWallet);
router.post('/enrollUser', ca_controller_1.default.enrollUser);
router.post('/reenroll', ca_controller_1.default.reenroll);
exports.default = router;
