import { body, validationResult, ValidationChain } from 'express-validator'
import { Request, Response, NextFunction } from 'express'
import { load } from 'js-yaml'


const loginValidation = (): ValidationChain[] => {
    return [
        // username must be an email
        body('email').isEmail(), //todo CHANGE
        // password must be at least 5 chars long
        body('password').isLength({ min: 5 }),
    ]
}

const addContractValidator = (): ValidationChain[] => {

    return [
        // ContractID not empty
        body('contractId').notEmpty(),
        //buyerID not Empty
        body('buyerId').notEmpty(),
        //maxWeight not Empty
        body('maxWeight').notEmpty(),
        //commodityID not Empty
        body('commodityId').notEmpty()
    ]

}

const updateContractValidator = (): ValidationChain[] => {
    return [
        // ContractID not empty
        body('contractId').notEmpty(),
        //buyerID not Empty
        body('status').notEmpty()
    ]
}

const updateOwnerValidator = (): ValidationChain[] => {
    return [
        // ContractID not empty
        body('contractId').notEmpty(),
        //newOwner ID not Empty
        body('newOwnerId').notEmpty()
    ]
}

const updateViewerValidator = (): ValidationChain[] => {
    return [
        // ContractID not empty
        body('contractId').notEmpty(),
        //newViewer ID not Empty
        body('newViewerId').notEmpty()
    ]
}

const deleteViewerValidator = () : ValidationChain[] => {
    return [
        // ContractID not empty
        body('contractId').notEmpty(),
        //Viewer ID not Empty
        body('viewerId').notEmpty()
    ]
}

const deleteOwnerValidator = () : ValidationChain[] => {
    return [
        // ContractID not empty
        body('contractId').notEmpty(),
        //Owner ID not Empty
        body('ownerId').notEmpty()
    ]
}

const addLoadToContractValidator = (): ValidationChain[] => {

    return [
        // ContractID not empty
        body('contractId', 'ContractId is required').notEmpty(),
        //buyerID not Empty
        body('loadId').notEmpty(),
        //maxWeight not Empty
        body('commodityId').notEmpty(),
        //commodityID not Empty
        body('weight', 'Weight is required').notEmpty(),
        //sellerID not empty
        body('sellerId').notEmpty(),
        //moisture not empty and is a number
        body('moisture').notEmpty().isNumeric()
    ]

}

const createValidation = (): ValidationChain[] => {
    return [// email format
        body('email').isEmail(),
        //username
        body('username').isLength({ min: 6 }),
        //role must be seller or admin?
        body('role').isIn(['seller', 'admin']),
        //password length min 5
        body('password', 'password min length is 5').isLength({ min: 5 }),
        //data is Json
        //body('data').isJSON(),
        //data  age validationd
        body('data.age').notEmpty(),
        //data is male validation
        body('data.isMale').notEmpty()
    ]
}

const validate = (req: Request, res: Response, next: NextFunction): unknown => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    const extractedErrors: { [x: string]: unknown }[] = []
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

    return res.status(422).json({
        errors: extractedErrors,
    })
}

export {
    loginValidation,
    createValidation,
    updateContractValidator,
    addContractValidator,
    addLoadToContractValidator,
    updateOwnerValidator,
    updateViewerValidator,
    deleteViewerValidator,
    deleteOwnerValidator,
    validate,
}