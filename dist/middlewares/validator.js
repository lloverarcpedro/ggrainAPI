"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.deleteOwnerValidator = exports.deleteViewerValidator = exports.updateViewerValidator = exports.updateOwnerValidator = exports.addLoadToContractValidator = exports.addContractValidator = exports.updateContractValidator = exports.createValidation = exports.loginValidation = void 0;
const express_validator_1 = require("express-validator");
const loginValidation = () => {
    return [
        // username must be an email
        express_validator_1.body('email').isEmail(),
        // password must be at least 5 chars long
        express_validator_1.body('password').isLength({ min: 5 }),
    ];
};
exports.loginValidation = loginValidation;
const addContractValidator = () => {
    return [
        // ContractID not empty
        express_validator_1.body('contractId').notEmpty(),
        //buyerID not Empty
        express_validator_1.body('buyerId').notEmpty(),
        //maxWeight not Empty
        express_validator_1.body('maxWeight').notEmpty(),
        //commodityID not Empty
        express_validator_1.body('commodityId').notEmpty()
    ];
};
exports.addContractValidator = addContractValidator;
const updateContractValidator = () => {
    return [
        // ContractID not empty
        express_validator_1.body('contractId').notEmpty(),
        //buyerID not Empty
        express_validator_1.body('status').notEmpty()
    ];
};
exports.updateContractValidator = updateContractValidator;
const updateOwnerValidator = () => {
    return [
        // ContractID not empty
        express_validator_1.body('contractId').notEmpty(),
        //newOwner ID not Empty
        express_validator_1.body('newOwnerId').notEmpty()
    ];
};
exports.updateOwnerValidator = updateOwnerValidator;
const updateViewerValidator = () => {
    return [
        // ContractID not empty
        express_validator_1.body('contractId').notEmpty(),
        //newViewer ID not Empty
        express_validator_1.body('newViewerId').notEmpty()
    ];
};
exports.updateViewerValidator = updateViewerValidator;
const deleteViewerValidator = () => {
    return [
        // ContractID not empty
        express_validator_1.body('contractId').notEmpty(),
        //Viewer ID not Empty
        express_validator_1.body('viewerId').notEmpty()
    ];
};
exports.deleteViewerValidator = deleteViewerValidator;
const deleteOwnerValidator = () => {
    return [
        // ContractID not empty
        express_validator_1.body('contractId').notEmpty(),
        //Owner ID not Empty
        express_validator_1.body('ownerId').notEmpty()
    ];
};
exports.deleteOwnerValidator = deleteOwnerValidator;
const addLoadToContractValidator = () => {
    return [
        // ContractID not empty
        express_validator_1.body('contractId', 'ContractId is required').notEmpty(),
        //buyerID not Empty
        express_validator_1.body('loadId').notEmpty(),
        //maxWeight not Empty
        express_validator_1.body('commodityId').notEmpty(),
        //commodityID not Empty
        express_validator_1.body('weight', 'Weight is required').notEmpty(),
        //sellerID not empty
        express_validator_1.body('sellerId').notEmpty(),
        //moisture not empty and is a number
        express_validator_1.body('moisture').notEmpty().isNumeric()
    ];
};
exports.addLoadToContractValidator = addLoadToContractValidator;
const createValidation = () => {
    return [
        express_validator_1.body('email').isEmail(),
        //username
        express_validator_1.body('username').isLength({ min: 6 }),
        //role must be seller or admin?
        express_validator_1.body('role').isIn(['seller', 'admin']),
        //password length min 5
        express_validator_1.body('password', 'password min length is 5').isLength({ min: 5 }),
        //data is Json
        //body('data').isJSON(),
        //data  age validationd
        express_validator_1.body('data.age').notEmpty(),
        //data is male validation
        express_validator_1.body('data.isMale').notEmpty()
    ];
};
exports.createValidation = createValidation;
const validate = (req, res, next) => {
    const errors = express_validator_1.validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));
    return res.status(422).json({
        errors: extractedErrors,
    });
};
exports.validate = validate;
