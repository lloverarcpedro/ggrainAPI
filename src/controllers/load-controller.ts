/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { addLoadToContract, getLoadById } from '../services/loads-services'
import { Request, Response } from 'express'


const addLoad = async (req: Request, res: Response) => {

    try {
        const txnId = await addLoadToContract(req)
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

const getLoad = async (req: Request, res: Response) => {
    try {

        const contractId = req.params.contractId
        const loadId = req.params.loadId
        const result = await getLoadById(req, contractId, loadId)
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


export default { addLoad, getLoad }