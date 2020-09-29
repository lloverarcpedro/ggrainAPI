"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const loads_services_1 = require("../services/loads-services");
const addLoad = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const txnId = yield loads_services_1.addLoadToContract(req);
        res.send({
            status: 'OK',
            data: txnId
        });
    }
    catch (error) {
        res.status(500).send({
            status: 'error',
            message: `An Error occurred: ${error.message}`
        });
    }
});
const getLoad = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contractId = req.params.contractId;
        const loadId = req.params.loadId;
        const result = yield loads_services_1.getLoadById(req, contractId, loadId);
        res.send({
            status: 'OK',
            data: result
        });
    }
    catch (error) {
        res.status(500).send({
            status: 'error',
            message: `An Error occurred: ${error.message}`
        });
    }
});
exports.default = { addLoad, getLoad };
