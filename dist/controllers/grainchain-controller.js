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
const grainchain_services_1 = require("../services/grainchain-services");
const createContract = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const txnId = yield grainchain_services_1.invokeContract(req);
        if ('message' in txnId) {
            const message = txnId['message'];
            throw Error(message.replace('Error: ERROR: ', ''));
        }
        res.send({
            status: 'OK',
            data: txnId
        });
    }
    catch (error) {
        res.status(500).send({
            status: 'error',
            message: error.message
        });
    }
});
const getContract = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contractId = req.params.id;
        const result = yield grainchain_services_1.getContractById(req, contractId);
        if ('message' in result) {
            const message = result['message'];
            throw Error(message.replace('Error: ERROR: ', ''));
        }
        res.send({
            status: 'OK',
            data: result
        });
    }
    catch (error) {
        res.status(500).send({
            status: 'error',
            message: error.message
        });
    }
});
const putContractStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield grainchain_services_1.putContract(req);
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
const addContractOwner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield grainchain_services_1.addOwner(req);
        if ('message' in result) {
            const message = result['message'];
            throw Error(message.replace('Error: ERROR: ', ''));
        }
        res.send({
            status: 'OK',
            data: result
        });
    }
    catch (error) {
        res.status(500).send({
            status: 'error',
            message: error.message
        });
    }
});
const addContractViewer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield grainchain_services_1.addViewer(req);
        if ('message' in result) {
            const message = result['message'];
            throw Error(message.replace('Error: ERROR: ', ''));
        }
        res.send({
            status: 'OK',
            data: result
        });
    }
    catch (error) {
        res.status(500).send({
            status: 'error',
            message: error.message
        });
    }
});
const deleteContractViewer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield grainchain_services_1.removeViewer(req);
        if ('message' in result) {
            const message = result['message'];
            throw Error(message.replace('Error: ERROR: ', ''));
        }
        res.send({
            status: 'OK',
            data: result
        });
    }
    catch (error) {
        res.status(500).send({
            status: 'error',
            message: error.message
        });
    }
});
const deleteContractOwner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield grainchain_services_1.removeOwner(req);
        if ('message' in result) {
            const message = result['message'];
            throw Error(message.replace('Error: ERROR: ', ''));
        }
        res.send({
            status: 'OK',
            data: result
        });
    }
    catch (error) {
        res.status(500).send({
            status: 'error',
            message: error.message
        });
    }
});
exports.default = { createContract, getContract, putContractStatus, addContractOwner, addContractViewer, deleteContractViewer, deleteContractOwner };
