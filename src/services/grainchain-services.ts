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
const CONTRACT_NAME = 'grainContract'


const invokeContract = async (req: Request): Promise<string> => {

    const { contractId, buyerId, maxWeight, commodityId } = req.body
    USER_ID = req.sessionData.email
    console.log('Invoke exectuted as: ', USER_ID)
    //1 get contract from gateway services
    const contract = await getContract(NETWORK_NAME, CONTRACT_ID, USER_ID, CONTRACT_NAME)

    // 4. Execute the transaction
    const prop = await submitTxnContract(contract, contractId, buyerId, maxWeight, commodityId)
    // Must give delay or use await here otherwise Error=MVCC_READ_CONFLICT
    console.log('var 1: ', prop)

    // 5. submitTxnTransaction
    return await submitTxnTransaction(contract, contractId, buyerId, maxWeight, commodityId)

}

const getContractById = async (req: Request, contractId: string): Promise<string> => {
    try {
        USER_ID = req.sessionData.email
        console.log('Query exectuted as: ', USER_ID)
        //get chaincode contract from gateway services
        const contract = await getContract(NETWORK_NAME, CONTRACT_ID, USER_ID, CONTRACT_NAME)
        //query the contract
        const response = await contract.evaluateTransaction('getContract', contractId)
        console.log(`Query Response=${response.toString()}`)
        return JSON.parse(response.toString())

    } catch (e) {
        console.log(e)
        return JSON.parse(`{"error":"${e}"}`)
    }
}

const putContract = async (req: Request): Promise<string> => {
    try {
        const { cStatus, contractId } = req.body
        USER_ID = req.sessionData.email
        console.log('Query exectuted as: ', USER_ID)
        //get chaincode contract from gateway services
        const contract = await getContract(NETWORK_NAME, CONTRACT_ID, USER_ID, CONTRACT_NAME)
        const responseSubmit = await contract.submitTransaction('putContract', contractId, cStatus)
        console.log('Submit Response=', responseSubmit.toString())
        const txn = contract.createTransaction('putContract')
        txn.addCommitListener(commitCallback)

        const response = await txn.submit(contractId, cStatus)
        console.log('Transaction.submit()=', response.toString())
        // Get the txn ID
        const txnID = txn.getTransactionID().getTransactionID()
        console.log('Transaction ID: ', txnID)
        return JSON.parse(`{"txnId":"${txnID}"}`)


    } catch (error) {
        console.log(error)
        return JSON.parse(`{"error":"${error}"}`)
    }
}

/**
 * Submit the transaction
 * @param {object} contract 
 */
async function submitTxnContract(contract: Contract, contractId: string, buyerId: string, maxWeight: string, commodityId: string) {
    try {
        // Submit the transaction
        const response = await contract.submitTransaction('addContract', contractId, buyerId, maxWeight, commodityId)
        console.log('Submit Response=', response.toString())
        return response.toString()
    } catch (e) {
        // fabric-network.TimeoutError
        console.log('ERROR: ', e)
        return e.message
    }
}

/**
 * Creates the transaction & uses the submit function
 * @param {object} contract 
 */
async function submitTxnTransaction(contract: Contract, contractId: string, buyerId: string, maxWeight: string, commodityId: string) {
    // Provide the function name
    const txn = contract.createTransaction('addContract')

    // Get the name of the transaction
    //console.log(txn.getName())

    // Get the txn ID
    const txnID = txn.getTransactionID().getTransactionID()
    console.log('Transaction Name: ', txn.getName().toString())
    txn.addCommitListener(commitCallback)
    // Submit the transaction
    try {
        const response = await txn.submit(contractId, buyerId, maxWeight, commodityId)
        console.log('Transaction.submit()=', response.toString())
        console.log('Transaction ID: ', txnID)
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

export { getContractById, invokeContract, putContract }