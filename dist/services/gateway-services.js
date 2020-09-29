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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContract = void 0;
const fabric_network_1 = require("fabric-network");
const fs_1 = __importDefault(require("fs"));
// Constants for profile
const CONNECTION_PROFILE_PATH = '/Users/pedrollovera/Documents/GCAPI/src/controllers/profiles/dev-harvx-connection.json';
// Path to the wallet
const FILESYSTEM_WALLET_PATH = '/Users/pedrollovera/Documents/GCAPI/wallet';
const getContract = (networkName, contractId, userId, contractName) => __awaiter(void 0, void 0, void 0, function* () {
    const gateway = new fabric_network_1.Gateway();
    // 1. Setup the gateway object
    yield setupGateway(gateway, userId);
    // 2. Get the network
    const network = yield gateway.getNetwork(networkName);
    //console.log(network)
    // 3. Get the contract
    const contract = yield network.getContract(contractId, contractName);
    // console.log(contract)
    return contract;
});
exports.getContract = getContract;
/**
 * Function for setting up the gateway
 * It does not actually connect to any peer/orderer
 */
function setupGateway(gateway, userId) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        // 1.1 load the connection profile into a JS object
        const connectionProfile = (_a = JSON.parse(fs_1.default.readFileSync(CONNECTION_PROFILE_PATH, 'utf8'))) !== null && _a !== void 0 ? _a : '';
        // 1.2 Need to setup the user credentials from wallet
        const wallet = new fabric_network_1.FileSystemWallet(FILESYSTEM_WALLET_PATH);
        // 1.3 Set up the connection options
        const connectionOptions = {
            identity: userId,
            wallet: wallet,
            discovery: { enabled: false, asLocalhost: true }
            /*** Uncomment lines below to disable commit listener on submit ****/
            ,
            eventHandlerOptions: {
                strategy: null
            }
            // ,eventHandlerOptions: {
            //     strategy: EventStrategies.NETWORK_SCOPE_ANYFORTX,
            //     commitTimeout: 10
            //     }
        };
        // 1.4 Connect gateway to the network
        yield gateway.connect(connectionProfile, connectionOptions);
    });
}
