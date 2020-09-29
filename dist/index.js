"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
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
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const index_1 = __importDefault(require("./routes/index"));
const fabric_client_1 = __importDefault(require("fabric-client"));
const CONNECTION_PROFILE_PATH = '/Users/pedrollovera/Documents/GCAPI/src/controllers/profiles/dev-harvx-connection.json';
const GRAINCHAIN_CLIENT_CONNECTION_PROFILE_PATH = '/Users/pedrollovera/Documents/GCAPI/src/controllers/profiles/dev-client-connection.json';
dotenv_1.default.config(); //Enable environment variables read.
const app = express_1.default();
app.use(body_parser_1.default.urlencoded({ extended: false })); //Enable urlencode body
app.use(body_parser_1.default.json()); //Enable json body
index_1.default(app);
const PORT = process.env.PORT || 4000;
mongoose_1.default
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    .connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
    console.log('Connected to MongoDB');
})
    .catch(error => {
    console.log('Connection Error', error);
});
//Register for events
setupEvents();
app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});
function setupEvents() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = fabric_client_1.default.loadFromConfig(CONNECTION_PROFILE_PATH);
        client.loadFromConfig(GRAINCHAIN_CLIENT_CONNECTION_PROFILE_PATH);
        yield client.initCredentialStores()
            .then(() => {
            console.log('credentials init ok');
        });
        const userContext = yield client.loadUserFromStateStore('admin');
        yield client.setUserContext(userContext);
        const channel = client.getChannel('grainchainchannel');
        //client.loadFromConfig(GRAINCHAIN_CLIENT_CONNECTION_PROFILE_PATH)
        const channelHub = channel.newChannelEventHub('peer1.grainchain.io');
        channelHub.registerChaincodeEvent('gocc', 'loadAdded', loadAddedCallback);
        channelHub.connect({ full_block: false }, (err, status) => {
            if (err) {
                console.log(err.message);
            }
            else {
                console.log('Status: ', status);
            }
        });
    });
}
function loadAddedCallback(event, blockNumber, txId, txStatus) {
    if (event) {
        console.log('Load Added Event Callback Triggered: ', event.payload);
        console.log('Load Added Event Callback Triggered: ', event.event_name);
        console.log('Load Added Event Callback Triggered: ', event.tx_id);
        console.log('Load Added Event Callback Triggered: ', event.chaincode_id);
        console.log('Load Added Event Callback Triggered: ', txStatus);
        //const eventSent = putMQMessage(`ChaincodeID: ${event.chaincode_id}, EventName: ${event.event_name}  Status:${txStatus}`)
        //console.log(eventSent)
    }
    else {
        console.log('event error, empty');
    }
}
