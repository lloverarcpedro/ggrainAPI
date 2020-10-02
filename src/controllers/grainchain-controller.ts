/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { invokeContract, getContractById, putContract } from '../services/grainchain-services'
import { Request, Response } from 'express'


const createContract = async (req: Request, res: Response) => {

    try {
        const txnId = await invokeContract(req)
        res.send({
            status: 'OK',
            data: txnId
        })
    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: `An Error occurred: ${error.message}`
        })
    }

}

const getContract = async (req: Request, res: Response) => {
    try {

        const contractId = req.params.id
        const result = await getContractById(req, contractId)
        res.send({
            status: 'OK',
            data: result
        })
    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: `An Error occurred: ${error.message}`
        })
    }
}

const putContractStatus = async (req: Request, res: Response) => {
    try {

        const result = await putContract(req)
        res.send({
            status: 'OK',
            data: result
        })
    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: `An Error occurred: ${error.message}`
        })
    }
}


export default { createContract, getContract, putContractStatus }