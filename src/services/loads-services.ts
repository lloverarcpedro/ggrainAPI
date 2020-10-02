import { Contract } from 'fabric-network'
import { getContract } from './gateway-services'
import { Request } from 'express'
import { load } from 'js-yaml'

// Identity context used
let USER_ID = ''
// Channel name
const NETWORK_NAME = 'grainchainchannel'
// Chaincode
const CONTRACT_ID = 'gocc1'

//Chaincode contract name
const CONTRACT_NAME = 'loadsContract'


const addLoadToContract = async (req: Request): Promise<string> => {

    const { contractId, loadId, commodityId, weight, sellerId, moisture, price } = req.body
    USER_ID = req.sessionData.email
    //1 get contract from gateway services
    const contract = await getContract(NETWORK_NAME, CONTRACT_ID, USER_ID, CONTRACT_NAME)

    // 4. Execute the transaction
    const contractSubmit = await submitTxnContract(contract, contractId, loadId, commodityId, weight, sellerId, moisture, price)
    if(contractSubmit.toString().startsWith('ERROR:')){
        throw Error(contractSubmit.toString())
    }
    // Must give delay or use await here otherwise Error=MVCC_READ_CONFLICT

    // 5. submitTxnTransaction
    return await submitTxnTransaction(contract, contractId, loadId, commodityId, weight, sellerId, moisture, price )

}

const getLoadById = async (req: Request, contractId: string, loadId: string): Promise<string> => {
    try {
        USER_ID = req.sessionData.email
        //get chaincode contract from gateway services
        const contract = await getContract(NETWORK_NAME, CONTRACT_ID, USER_ID, CONTRACT_NAME)
        //query the contract
        const response = await contract.evaluateTransaction('getLoad', contractId, loadId)
        console.log(`Query Response=${response.toString()}`)
        return JSON.parse(response.toString())

    } catch (e) {
        console.log(e)
        return JSON.parse(`{"error":"${e}"}`)
    }
}

const getPrivateLoad = async (req: Request, contractId: string, loadId: string): Promise<string> => {
    try{
        USER_ID = req.sessionData.email
        //get chaincode contract from gateway services
        const contract = await getContract(NETWORK_NAME, CONTRACT_ID, USER_ID, CONTRACT_NAME)
        //query the contract
        const response = await contract.evaluateTransaction('getPrivateLoad',contractId, loadId)
        console.log(`Private Query Response=${response.toString()}`)
        return JSON.parse(response.toString())


    }catch(error){
        console.log(error)
        return JSON.parse(`{"error":"${error.message}"}`)
    }
}

/**
 * Submit the transaction
 * @param {object} contract 
 */
async function submitTxnContract(contract: Contract, contractId: string, loadId: string, commodityId: string, weight: string, sellerId: string, moisture: string, price: string) {
    try {
        // Submit the transaction
        const response = await contract.submitTransaction('addLoad',contractId, loadId, commodityId, weight, sellerId, moisture, price)
        console.log('Submit Response=', response.toString())
        if(response.toString().startsWith('ERROR:')){
            throw Error(response.toString())
        }
        return response.toString()
    } catch (e) {
        // fabric-network.TimeoutError
        console.log(e)
        return e.message
    }
}

/**
 * Creates the transaction & uses the submit function
 * @param {object} contract 
 */
async function submitTxnTransaction(contract: Contract, contractId: string, loadId: string, commodityId: string, weight: string, sellerId: string, moisture: string, price: string) {
    // Provide the function name
    const txn = contract.createTransaction('addLoad')

    // Get the name of the transaction
    //console.log(txn.getName())

    // Get the txn ID
    const txnID = txn.getTransactionID().getTransactionID()
    //console.log(txn.getTransactionID())

    // Submit the transaction
    try {
        const response = await txn.submit(contractId, loadId, commodityId, weight, sellerId, moisture, price)
        console.log('Transaction.submit()=', response.toString())
        console.log('Transaction ID: ', txnID)
        return JSON.parse(`{"txnId":"${txnID}"}`)
    } catch (e) {
        console.log(e)
    }
}

export { getLoadById, addLoadToContract, getPrivateLoad }