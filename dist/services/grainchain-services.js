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
exports.removeViewer = exports.removeOwner = exports.addViewer = exports.addOwner = exports.putContract = exports.invokeContract = exports.getContractById = void 0;
const gateway_services_1 = require("./gateway-services");
// Identity context used
let USER_ID = 'admin';
// Channel name
const NETWORK_NAME = 'grainchainchannel';
// Chaincode
const CONTRACT_ID = 'gocc1';
//Chaincode contract name
const CONTRACT_NAME = 'futureContract';
const invokeContract = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { contractId, maxWeight, commodityId } = req.body;
        USER_ID = req.sessionData.email;
        console.log('Invoke exectuted as: ', USER_ID);
        //1 get contract from gateway services
        const contract = yield gateway_services_1.getContract(NETWORK_NAME, CONTRACT_ID, USER_ID, CONTRACT_NAME);
        // 4. Execute the transaction
        const prop = yield submitTxnContract(contract, contractId, maxWeight, commodityId);
        // Must give delay or use await here otherwise Error=MVCC_READ_CONFLICT
        if (prop.includes('ERROR:')) {
            throw Error(prop);
        }
        // 5. submitTxnTransaction
        return yield submitTxnTransaction(contract, contractId, maxWeight, commodityId);
    }
    catch (error) {
        return JSON.parse(`{"message":"${error}"}`);
    }
});
exports.invokeContract = invokeContract;
const getContractById = (req, contractId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        USER_ID = req.sessionData.email;
        console.log('Query exectuted as: ', USER_ID);
        //get chaincode contract from gateway services
        const contract = yield gateway_services_1.getContract(NETWORK_NAME, CONTRACT_ID, USER_ID, CONTRACT_NAME);
        //query the contract
        const response = yield contract.evaluateTransaction('getFuture', contractId);
        console.log(`Query Response=${response.toString()}`);
        if (response.includes('ERROR:')) {
            throw Error(response.toString());
        }
        return JSON.parse(response.toString());
    }
    catch (e) {
        console.log(e);
        return JSON.parse(`{"message":"${e}"}`);
    }
});
exports.getContractById = getContractById;
const putContract = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cStatus, contractId } = req.body;
        USER_ID = req.sessionData.email;
        console.log('Query exectuted as: ', USER_ID);
        //get chaincode contract from gateway services
        const contract = yield gateway_services_1.getContract(NETWORK_NAME, CONTRACT_ID, USER_ID, CONTRACT_NAME);
        const responseSubmit = yield contract.submitTransaction('putFuture', contractId, cStatus);
        console.log('Submit Response=', responseSubmit.toString());
        const txn = contract.createTransaction('putFuture');
        txn.addCommitListener(commitCallback);
        const response = yield txn.submit(contractId, cStatus);
        console.log('Transaction.submit()=', response.toString());
        // Get the txn ID
        const txnID = txn.getTransactionID().getTransactionID();
        console.log('Transaction ID: ', txnID);
        return JSON.parse(`{"txnId":"${txnID}"}`);
    }
    catch (error) {
        console.log(error);
        return JSON.parse(`{"message":"${error}"}`);
    }
});
exports.putContract = putContract;
const addOwner = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { contractId, newOwnerId } = req.body;
        USER_ID = req.sessionData.email;
        console.log('AddOwnder exectuted as: ', USER_ID);
        //get chaincode contract from gateway services
        const contract = yield gateway_services_1.getContract(NETWORK_NAME, CONTRACT_ID, USER_ID, CONTRACT_NAME);
        const responseSubmit = yield contract.submitTransaction('addOwner', contractId, newOwnerId);
        console.log('Submit Response=', responseSubmit.toString());
        if (responseSubmit.includes('ERROR:')) {
            throw Error(responseSubmit.toString());
        }
        const txn = contract.createTransaction('addOwner');
        txn.addCommitListener(commitCallback);
        const response = yield txn.submit(contractId, newOwnerId);
        console.log('Transaction.submit()=', response.toString());
        if (responseSubmit.includes('ERROR:')) {
            throw Error(responseSubmit.toString());
        }
        // Get the txn ID
        const txnID = txn.getTransactionID().getTransactionID();
        console.log('Transaction ID: ', txnID);
        return JSON.parse(`{"txnId":"${txnID}"}`);
    }
    catch (error) {
        console.log(error);
        return JSON.parse(`{"message":"${error}"}`);
    }
});
exports.addOwner = addOwner;
const addViewer = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { contractId, newViewerId } = req.body;
        USER_ID = req.sessionData.email;
        console.log('AddViewer exectuted as: ', USER_ID);
        //get chaincode contract from gateway services
        const contract = yield gateway_services_1.getContract(NETWORK_NAME, CONTRACT_ID, USER_ID, CONTRACT_NAME);
        const responseSubmit = yield contract.submitTransaction('addViewer', contractId, newViewerId);
        console.log('Submit Response=', responseSubmit.toString());
        if (responseSubmit.includes('ERROR:')) {
            throw Error(responseSubmit.toString());
        }
        const txn = contract.createTransaction('addViewer');
        txn.addCommitListener(commitCallback);
        const response = yield txn.submit(contractId, newViewerId);
        console.log('Transaction.submit()=', response.toString());
        if (responseSubmit.includes('ERROR:')) {
            throw Error(responseSubmit.toString());
        }
        // Get the txn ID
        const txnID = txn.getTransactionID().getTransactionID();
        console.log('Transaction ID: ', txnID);
        return JSON.parse(`{"txnId":"${txnID}"}`);
    }
    catch (error) {
        console.log(error);
        return JSON.parse(`{"message":"${error}"}`);
    }
});
exports.addViewer = addViewer;
const removeOwner = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { contractId, ownerId } = req.body;
        USER_ID = req.sessionData.email;
        console.log('removeOwner exectuted as: ', USER_ID);
        //get chaincode contract from gateway services
        const contract = yield gateway_services_1.getContract(NETWORK_NAME, CONTRACT_ID, USER_ID, CONTRACT_NAME);
        const responseSubmit = yield contract.submitTransaction('removeOwner', contractId, ownerId);
        console.log('Submit Response=', responseSubmit.toString());
        if (responseSubmit.includes('ERROR:')) {
            throw Error(responseSubmit.toString());
        }
        const txn = contract.createTransaction('removeOwner');
        txn.addCommitListener(commitCallback);
        const response = yield txn.submit(contractId, ownerId);
        console.log('Transaction.submit()=', response.toString());
        if (responseSubmit.includes('ERROR:')) {
            throw Error(responseSubmit.toString());
        }
        // Get the txn ID
        const txnID = txn.getTransactionID().getTransactionID();
        console.log('Transaction ID: ', txnID);
        return JSON.parse(`{"txnId":"${txnID}"}`);
    }
    catch (error) {
        console.log(error);
        return JSON.parse(`{"message":"${error}"}`);
    }
});
exports.removeOwner = removeOwner;
const removeViewer = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { contractId, viewerId } = req.body;
        USER_ID = req.sessionData.email;
        console.log('removeViewer exectuted as: ', USER_ID);
        //get chaincode contract from gateway services
        const contract = yield gateway_services_1.getContract(NETWORK_NAME, CONTRACT_ID, USER_ID, CONTRACT_NAME);
        const responseSubmit = yield contract.submitTransaction('removeViewer', contractId, viewerId);
        console.log('Submit Response=', responseSubmit.toString());
        if (responseSubmit.includes('ERROR:')) {
            throw Error(responseSubmit.toString());
        }
        const txn = contract.createTransaction('removeViewer');
        txn.addCommitListener(commitCallback);
        const response = yield txn.submit(contractId, viewerId);
        console.log('Transaction.submit()=', response.toString());
        if (responseSubmit.includes('ERROR:')) {
            throw Error(responseSubmit.toString());
        }
        // Get the txn ID
        const txnID = txn.getTransactionID().getTransactionID();
        console.log('Transaction ID: ', txnID);
        return JSON.parse(`{"txnId":"${txnID}"}`);
    }
    catch (error) {
        console.log(error);
        return JSON.parse(`{"message":"${error}"}`);
    }
});
exports.removeViewer = removeViewer;
/**
 * Submit the transaction
 * @param {object} contract
 */
function submitTxnContract(contract, contractId, maxWeight, commodityId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Submit the transaction
            const response = yield contract.submitTransaction('addFuture', contractId, maxWeight, commodityId);
            console.log('Submit Response=', response.toString());
            return response.toString();
        }
        catch (e) {
            // fabric-network.TimeoutError
            return e.message;
        }
    });
}
/**
 * Creates the transaction & uses the submit function
 * @param {object} contract
 */
function submitTxnTransaction(contract, contractId, maxWeight, commodityId) {
    return __awaiter(this, void 0, void 0, function* () {
        // Provide the function name
        const txn = contract.createTransaction('addFuture');
        // Get the name of the transaction
        //console.log(txn.getName())
        // Get the txn ID
        const txnID = txn.getTransactionID().getTransactionID();
        console.log('Transaction Name: ', txn.getName().toString());
        txn.addCommitListener(commitCallback);
        // Submit the transaction
        try {
            const response = yield txn.submit(contractId, maxWeight, commodityId);
            console.log('Transaction.submit()=', response.toString());
            console.log('Transaction ID: ', txnID);
            if (response.toString().includes('ERROR:')) {
                throw new Error(response.toString());
            }
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
