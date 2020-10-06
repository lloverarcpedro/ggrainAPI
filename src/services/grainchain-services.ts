import { Contract } from 'fabric-network'
import { getContract } from './gateway-services'
import { Request } from 'express'

// Identity context used
let USER_ID = 'admin'
// Channel name
const NETWORK_NAME = 'grainchainchannel'
// Chaincode
const CONTRACT_ID = 'gocc1'

//Chaincode contract name
const CONTRACT_NAME = 'futureContract'


const invokeContract = async (req: Request): Promise<JSON> => {
    try {
        const { contractId, maxWeight, commodityId } = req.body
        USER_ID = req.sessionData.email
        console.log('Invoke exectuted as: ', USER_ID)
        //1 get contract from gateway services
        const contract = await getContract(NETWORK_NAME, CONTRACT_ID, USER_ID, CONTRACT_NAME)

        // 4. Execute the transaction
        const prop = await submitTxnContract(contract, contractId, maxWeight, commodityId)
        // Must give delay or use await here otherwise Error=MVCC_READ_CONFLICT
        if (prop.includes('ERROR:')) {
            throw Error(prop)
        }

        // 5. submitTxnTransaction
        return await submitTxnTransaction(contract, contractId, maxWeight, commodityId)
    } catch (error) {
        return JSON.parse(`{"message":"${error}"}`)
    }
}

const getContractById = async (req: Request, contractId: string): Promise<JSON> => {
    try {
        USER_ID = req.sessionData.email
        console.log('Query exectuted as: ', USER_ID)
        //get chaincode contract from gateway services
        const contract = await getContract(NETWORK_NAME, CONTRACT_ID, USER_ID, CONTRACT_NAME)
        //query the contract
        const response = await contract.evaluateTransaction('getFuture', contractId)
        console.log(`Query Response=${response.toString()}`)
        if (response.includes('ERROR:')) {
            throw Error(response.toString())
        }
        return JSON.parse(response.toString())

    } catch (e) {
        console.log(e)
        return JSON.parse(`{"message":"${e}"}`)
    }
}

const putContract = async (req: Request): Promise<string> => {
    try {
        const { cStatus, contractId } = req.body
        USER_ID = req.sessionData.email
        console.log('Query exectuted as: ', USER_ID)
        //get chaincode contract from gateway services
        const contract = await getContract(NETWORK_NAME, CONTRACT_ID, USER_ID, CONTRACT_NAME)
        const responseSubmit = await contract.submitTransaction('putFuture', contractId, cStatus)
        console.log('Submit Response=', responseSubmit.toString())
        const txn = contract.createTransaction('putFuture')
        txn.addCommitListener(commitCallback)

        const response = await txn.submit(contractId, cStatus)
        console.log('Transaction.submit()=', response.toString())
        // Get the txn ID
        const txnID = txn.getTransactionID().getTransactionID()
        console.log('Transaction ID: ', txnID)
        return JSON.parse(`{"txnId":"${txnID}"}`)


    } catch (error) {
        console.log(error)
        return JSON.parse(`{"message":"${error}"}`)
    }
}

const addOwner = async (req: Request): Promise<JSON> => {

    try {
        const { contractId, newOwnerId } = req.body
        USER_ID = req.sessionData.email
        console.log('AddOwnder exectuted as: ', USER_ID)
        //get chaincode contract from gateway services
        const contract = await getContract(NETWORK_NAME, CONTRACT_ID, USER_ID, CONTRACT_NAME)
        const responseSubmit = await contract.submitTransaction('addOwner', contractId, newOwnerId)
        console.log('Submit Response=', responseSubmit.toString())
        if (responseSubmit.includes('ERROR:')) {
            throw Error(responseSubmit.toString())
        }
        const txn = contract.createTransaction('addOwner')
        txn.addCommitListener(commitCallback)

        const response = await txn.submit(contractId, newOwnerId)
        console.log('Transaction.submit()=', response.toString())
        if (responseSubmit.includes('ERROR:')) {
            throw Error(responseSubmit.toString())
        }
        // Get the txn ID
        const txnID = txn.getTransactionID().getTransactionID()
        console.log('Transaction ID: ', txnID)
        return JSON.parse(`{"txnId":"${txnID}"}`)


    } catch (error) {
        console.log(error)
        return JSON.parse(`{"message":"${error}"}`)
    }
}

const addViewer = async (req: Request): Promise<JSON> => {

    try {
        const { contractId, newViewerId } = req.body
        USER_ID = req.sessionData.email
        console.log('AddViewer exectuted as: ', USER_ID)
        //get chaincode contract from gateway services
        const contract = await getContract(NETWORK_NAME, CONTRACT_ID, USER_ID, CONTRACT_NAME)
        const responseSubmit = await contract.submitTransaction('addViewer', contractId, newViewerId)
        console.log('Submit Response=', responseSubmit.toString())
        if (responseSubmit.includes('ERROR:')) {
            throw Error(responseSubmit.toString())
        }
        const txn = contract.createTransaction('addViewer')
        txn.addCommitListener(commitCallback)

        const response = await txn.submit(contractId, newViewerId)
        console.log('Transaction.submit()=', response.toString())
        if (responseSubmit.includes('ERROR:')) {
            throw Error(responseSubmit.toString())
        }
        // Get the txn ID
        const txnID = txn.getTransactionID().getTransactionID()
        console.log('Transaction ID: ', txnID)
        return JSON.parse(`{"txnId":"${txnID}"}`)


    } catch (error) {
        console.log(error)
        return JSON.parse(`{"message":"${error}"}`)
    }
}

const removeOwner = async (req: Request): Promise<JSON> => {
    try {
        const { contractId, ownerId } = req.body

        USER_ID = req.sessionData.email
        console.log('removeOwner exectuted as: ', USER_ID)
        //get chaincode contract from gateway services
        const contract = await getContract(NETWORK_NAME, CONTRACT_ID, USER_ID, CONTRACT_NAME)
        const responseSubmit = await contract.submitTransaction('removeOwner', contractId, ownerId)
        console.log('Submit Response=', responseSubmit.toString())
        if (responseSubmit.includes('ERROR:')) {
            throw Error(responseSubmit.toString())
        }
        const txn = contract.createTransaction('removeOwner')
        txn.addCommitListener(commitCallback)
        const response = await txn.submit(contractId, ownerId)
        console.log('Transaction.submit()=', response.toString())
        if (responseSubmit.includes('ERROR:')) {
            throw Error(responseSubmit.toString())
        }

        // Get the txn ID
        const txnID = txn.getTransactionID().getTransactionID()
        console.log('Transaction ID: ', txnID)
        return JSON.parse(`{"txnId":"${txnID}"}`)
    } catch (error) {
        console.log(error)
        return JSON.parse(`{"message":"${error}"}`)
    }
}

const removeViewer = async (req: Request): Promise<JSON> => {
    try {
        const { contractId, viewerId } = req.body

        USER_ID = req.sessionData.email
        console.log('removeViewer exectuted as: ', USER_ID)
        //get chaincode contract from gateway services
        const contract = await getContract(NETWORK_NAME, CONTRACT_ID, USER_ID, CONTRACT_NAME)
        const responseSubmit = await contract.submitTransaction('removeViewer', contractId, viewerId)
        console.log('Submit Response=', responseSubmit.toString())
        if (responseSubmit.includes('ERROR:')) {
            throw Error(responseSubmit.toString())
        }
        const txn = contract.createTransaction('removeViewer')
        txn.addCommitListener(commitCallback)
        const response = await txn.submit(contractId, viewerId)
        console.log('Transaction.submit()=', response.toString())
        if (responseSubmit.includes('ERROR:')) {
            throw Error(responseSubmit.toString())
        }

        // Get the txn ID
        const txnID = txn.getTransactionID().getTransactionID()
        console.log('Transaction ID: ', txnID)
        return JSON.parse(`{"txnId":"${txnID}"}`)
    } catch (error) {
        console.log(error)
        return JSON.parse(`{"message":"${error}"}`)
    }
}

/**
 * Submit the transaction
 * @param {object} contract 
 */
async function submitTxnContract(contract: Contract, contractId: string, maxWeight: string, commodityId: string) {
    try {
        // Submit the transaction
        const response = await contract.submitTransaction('addFuture', contractId, maxWeight, commodityId)
        console.log('Submit Response=', response.toString())
        return response.toString()
    } catch (e) {
        // fabric-network.TimeoutError
        return e.message
    }
}

/**
 * Creates the transaction & uses the submit function
 * @param {object} contract 
 */
async function submitTxnTransaction(contract: Contract, contractId: string, maxWeight: string, commodityId: string) {
    // Provide the function name
    const txn = contract.createTransaction('addFuture')

    // Get the name of the transaction
    //console.log(txn.getName())

    // Get the txn ID
    const txnID = txn.getTransactionID().getTransactionID()
    console.log('Transaction Name: ', txn.getName().toString())
    txn.addCommitListener(commitCallback)
    // Submit the transaction
    try {
        const response = await txn.submit(contractId, maxWeight, commodityId)
        console.log('Transaction.submit()=', response.toString())
        console.log('Transaction ID: ', txnID)
        if (response.toString().includes('ERROR:')) {
            throw new Error(response.toString())
        }
        return JSON.parse(`{"txnId":"${txnID}"}`)
    } catch (e) {
        console.log(e)
    }
}

async function commitCallback(error: Error, transactionId?: string | undefined, status?: string | undefined, blockNumber?: string | undefined) {
    if (!error) {
        const txnId = transactionId ?? ''
        const txnStatus = status ?? ''
        const txnBlockNumber = blockNumber ?? ''
        console.log('Transaction is now Commited TX: ', txnId)
        console.log('Transaction status: ', txnStatus)
        console.log('Transaction block Number commited', txnBlockNumber)
    } else {
        console.log('Transacciont commit Error', error.message)
    }
}

export { getContractById, invokeContract, putContract, addOwner, addViewer, removeOwner, removeViewer }