/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { invokeContract, getContractById, putContract, addOwner, addViewer, removeViewer, removeOwner } from '../services/grainchain-services'
import { Request, Response } from 'express'


const createContract = async (req: Request, res: Response) => {

    try {
        const txnId : JSON = await invokeContract(req)
        if('message' in txnId){
            const message : string = txnId['message']
            throw Error (message.replace('Error: ERROR: ',''))
        }
        res.send({
            status: 'OK',
            data: txnId
        })
    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: error.message
        })
    }

}

const getContract = async (req: Request, res: Response) => {
    try {

        const contractId = req.params.id
        const result = await getContractById(req, contractId)
        if('message' in result){
            const message : string = result['message']
            throw Error (message.replace('Error: ERROR: ',''))
        }
        res.send({
            status: 'OK',
            data: result
        })
    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: error.message
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

const addContractOwner = async (req:Request, res: Response) => {
    try{
        const result = await addOwner(req)
        if('message' in result){
            const message : string = result['message']
            throw Error (message.replace('Error: ERROR: ',''))
        }
        res.send({
            status: 'OK',
            data: result
        })
    }catch(error){
        res.status(500).send({
            status: 'error',
            message: error.message
        })
    }
}

const addContractViewer = async (req:Request, res: Response) => {
    try{
        const result = await addViewer(req)
        if('message' in result){
            const message : string = result['message']
            throw Error (message.replace('Error: ERROR: ',''))
        }
        res.send({
            status: 'OK',
            data: result
        })
    }catch(error){
        res.status(500).send({
            status: 'error',
            message: error.message
        })
    }
}

const deleteContractViewer = async (req:Request, res: Response) => {
    try{
        const result = await removeViewer(req)
        if('message' in result){
            const message : string = result['message']
            throw Error (message.replace('Error: ERROR: ',''))
        }
        res.send({
            status: 'OK',
            data: result
        })
    }catch(error){
        res.status(500).send({
            status: 'error',
            message: error.message
        })
    }
}

const deleteContractOwner = async (req:Request, res: Response) => {
    try{
        const result = await removeOwner(req)
        if('message' in result){
            const message : string = result['message']
            throw Error (message.replace('Error: ERROR: ',''))
        }
        res.send({
            status: 'OK',
            data: result
        })
    }catch(error){
        res.status(500).send({
            status: 'error',
            message: error.message
        })
    }
}

export default { createContract, getContract, putContractStatus, addContractOwner, addContractViewer, deleteContractViewer, deleteContractOwner }