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
exports.getPrivateLoad = exports.addLoadToContract = exports.getLoadById = void 0;
const gateway_services_1 = require("./gateway-services");
// Identity context used
let USER_ID = '';
// Channel name
const NETWORK_NAME = 'grainchainchannel';
// Chaincode
const CONTRACT_ID = 'gocc1';
//Chaincode contract name
const CONTRACT_NAME = 'loadsContract';
const addLoadToContract = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId, loadId, commodityId, weight, sellerId, moisture, price } = req.body;
    USER_ID = req.sessionData.email;
    //1 get contract from gateway services
    const contract = yield gateway_services_1.getContract(NETWORK_NAME, CONTRACT_ID, USER_ID, CONTRACT_NAME);
    // 4. Execute the transaction
    const contractSubmit = yield submitTxnContract(contract, contractId, loadId, commodityId, weight, sellerId, moisture, price);
    if (contractSubmit.toString().startsWith('ERROR:')) {
        throw Error(contractSubmit.toString());
    }
    // Must give delay or use await here otherwise Error=MVCC_READ_CONFLICT
    // 5. submitTxnTransaction
    return yield submitTxnTransaction(contract, contractId, loadId, commodityId, weight, sellerId, moisture, price);
});
exports.addLoadToContract = addLoadToContract;
const getLoadById = (req, contractId, loadId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        USER_ID = req.sessionData.email;
        //get chaincode contract from gateway services
        const contract = yield gateway_services_1.getContract(NETWORK_NAME, CONTRACT_ID, USER_ID, CONTRACT_NAME);
        //query the contract
        const response = yield contract.evaluateTransaction('getLoad', contractId, loadId);
        console.log(`Query Response=${response.toString()}`);
        return JSON.parse(response.toString());
    }
    catch (e) {
        console.log(e);
        return JSON.parse(`{"error":"${e}"}`);
    }
});
exports.getLoadById = getLoadById;
const getPrivateLoad = (req, contractId, loadId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        USER_ID = req.sessionData.email;
        //get chaincode contract from gateway services
        const contract = yield gateway_services_1.getContract(NETWORK_NAME, CONTRACT_ID, USER_ID, CONTRACT_NAME);
        //query the contract
        const response = yield contract.evaluateTransaction('getPrivateLoad', contractId, loadId);
        console.log(`Private Query Response=${response.toString()}`);
        return JSON.parse(response.toString());
    }
    catch (error) {
        console.log(error);
        return JSON.parse(`{"error":"${error.message}"}`);
    }
});
exports.getPrivateLoad = getPrivateLoad;
/**
 * Submit the transaction
 * @param {object} contract
 */
function submitTxnContract(contract, contractId, loadId, commodityId, weight, sellerId, moisture, price) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Submit the transaction
            const response = yield contract.submitTransaction('addLoad', contractId, loadId, commodityId, weight, sellerId, moisture, price);
            console.log('Submit Response=', response.toString());
            if (response.toString().startsWith('ERROR:')) {
                throw Error(response.toString());
            }
            return response.toString();
        }
        catch (e) {
            // fabric-network.TimeoutError
            console.log(e);
            return e.message;
        }
    });
}
/**
 * Creates the transaction & uses the submit function
 * @param {object} contract
 */
function submitTxnTransaction(contract, contractId, loadId, commodityId, weight, sellerId, moisture, price) {
    return __awaiter(this, void 0, void 0, function* () {
        // Provide the function name
        const txn = contract.createTransaction('addLoad');
        // Get the name of the transaction
        //console.log(txn.getName())
        // Get the txn ID
        const txnID = txn.getTransactionID().getTransactionID();
        //console.log(txn.getTransactionID())
        // Submit the transaction
        try {
            const response = yield txn.submit(contractId, loadId, commodityId, weight, sellerId, moisture, price);
            console.log('Transaction.submit()=', response.toString());
            console.log('Transaction ID: ', txnID);
            return JSON.parse(`{"txnId":"${txnID}"}`);
        }
        catch (e) {
            console.log(e);
        }
    });
}
