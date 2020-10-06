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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupEvents = void 0;
const fabric_client_1 = __importDefault(require("fabric-client"));
const mq_services_1 = require("./mq-services");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); //Enable environment variables read.
const CONNECTION_PROFILE_PATH = '/Users/pedrollovera/Documents/GCAPI/src/controllers/profiles/dev-harvx-connection.json';
const GRAINCHAIN_CLIENT_CONNECTION_PROFILE_PATH = '/Users/pedrollovera/Documents/GCAPI/src/controllers/profiles/dev-client-connection.json';
const eventPeer = (_a = process.env.DEFAULT_EVENTS_PEER) !== null && _a !== void 0 ? _a : '';
function setupEvents() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = fabric_client_1.default.loadFromConfig(CONNECTION_PROFILE_PATH);
            client.loadFromConfig(GRAINCHAIN_CLIENT_CONNECTION_PROFILE_PATH);
            yield client.initCredentialStores()
                .then(() => {
                console.log('credentials init ok');
            })
                .catch((err) => {
                throw err;
            });
            const userContext = yield client.loadUserFromStateStore('admin');
            yield client.setUserContext(userContext);
            const channel = client.getChannel('grainchainchannel');
            //client.loadFromConfig(GRAINCHAIN_CLIENT_CONNECTION_PROFILE_PATH)
            const channelHub = channel.newChannelEventHub(eventPeer);
            channelHub.registerChaincodeEvent('gocc', 'contractAdded', eReceiverCallback); //TODO change to receive any type of event from chaincode name x
            channelHub.connect({ full_block: false }, (err, status) => {
                if (err) {
                    throw err;
                }
                else {
                    console.log('Status: ', status);
                }
            });
        }
        catch (error) {
            console.log(error.message);
        }
    });
}
exports.setupEvents = setupEvents;
function eReceiverCallback(event, blockNumber, txId, txStatus) {
    if (event) {
        console.log('Event Callback Triggered: ', event.payload);
        console.log('Event Callback Triggered: ', event.event_name);
        console.log('Callback Triggered: ', event.tx_id);
        console.log('Event Callback Triggered: ', event.chaincode_id);
        console.log('Event Callback Triggered: ', txStatus);
        const eventSent = mq_services_1.putMQMessage(`ChaincodeID: ${event.chaincode_id}, EventName: ${event.event_name}  Status:${txStatus}`, 'gcbc'); // @message: string, @channel: RabitMQ-QueueName
        console.log(eventSent);
    }
    else {
        console.log('event error, empty');
        throw new Error(`Event Reception Error ${txId}`);
    }
}
