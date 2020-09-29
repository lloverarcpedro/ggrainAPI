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
exports.invokeContract = exports.getContractById = void 0;
const gateway_services_1 = require("./gateway-services");
// Identity context used
let USER_ID = 'admin';
// Channel name
const NETWORK_NAME = 'grainchainchannel';
// Chaincode
const CONTRACT_ID = 'gocc1';
//Chaincode contract name
const CONTRACT_NAME = 'grainContract';
const invokeContract = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId, buyerId, maxWeight, commodityId } = req.body;
    USER_ID = req.sessionData.email;
    console.log('Invoke exectuted as: ', USER_ID);
    //1 get contract from gateway services
    const contract = yield gateway_services_1.getContract(NETWORK_NAME, CONTRACT_ID, USER_ID, CONTRACT_NAME);
    // 4. Execute the transaction
    const prop = yield submitTxnContract(contract, contractId, buyerId, maxWeight, commodityId);
    // Must give delay or use await here otherwise Error=MVCC_READ_CONFLICT
    console.log('var 1: ', prop);
    // 5. submitTxnTransaction
    return yield submitTxnTransaction(contract, contractId, buyerId, maxWeight, commodityId);
});
exports.invokeContract = invokeContract;
const getContractById = (req, contractId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        USER_ID = req.sessionData.email;
        console.log('Query exectuted as: ', USER_ID);
        //get chaincode contract from gateway services
        const contract = yield gateway_services_1.getContract(NETWORK_NAME, CONTRACT_ID, USER_ID, CONTRACT_NAME);
        //query the contract
        const response = yield contract.evaluateTransaction('getContract', contractId);
        console.log(`Query Response=${response.toString()}`);
        return JSON.parse(response.toString());
    }
    catch (e) {
        console.log(e);
        return JSON.parse(`{"error":"${e}"}`);
    }
});
exports.getContractById = getContractById;
/**
 * Submit the transaction
 * @param {object} contract
 */
function submitTxnContract(contract, contractId, buyerId, maxWeight, commodityId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Submit the transaction
            const response = yield contract.submitTransaction('addContract', contractId, buyerId, maxWeight, commodityId);
            console.log('Submit Response=', response.toString());
            return response.toString();
        }
        catch (e) {
            // fabric-network.TimeoutError
            console.log('ERROR: ', e);
            return e.message;
        }
    });
}
/**
 * Creates the transaction & uses the submit function
 * @param {object} contract
 */
function submitTxnTransaction(contract, contractId, buyerId, maxWeight, commodityId) {
    return __awaiter(this, void 0, void 0, function* () {
        // Provide the function name
        const txn = contract.createTransaction('addContract');
        // Get the name of the transaction
        //console.log(txn.getName())
        // Get the txn ID
        const txnID = txn.getTransactionID().getTransactionID();
        console.log('Transaction Name: ', txn.getName().toString());
        txn.addCommitListener(commitCallback);
        // Submit the transaction
        try {
            const response = yield txn.submit(contractId, buyerId, maxWeight, commodityId);
            console.log('Transaction.submit()=', response.toString());
            console.log('Transaction ID: ', txnID);
            return JSON.parse(`{"txnId":"${txnID}"}`);
        }
        catch (e) {
            console.log(e);
        }
    });
}
function commitCallback(error, transactionId, status, blockNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!error) {
            const txnId = transactionId !== null && transactionId !== void 0 ? transactionId : '';
            const txnStatus = status !== null && status !== void 0 ? status : '';
            const txnBlockNumber = blockNumber !== null && blockNumber !== void 0 ? blockNumber : '';
            console.log('Transaction is now Commited TX: ', txnId);
            console.log('Transaction status: ', txnStatus);
            console.log('Transaction block Number commited', txnBlockNumber);
        }
        else {
            console.log('Transacciont commit Error', error.message);
        }
    });
}
