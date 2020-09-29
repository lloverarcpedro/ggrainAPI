"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.putMQMessage = void 0;
const mq_services_1 = require("../services/mq-services");
const putMQMessage = (message) => {
    try {
        const sent = mq_services_1.mqconnect(message);
        console.log(sent);
    }
    catch (error) {
        console.log(error);
    }
};
exports.putMQMessage = putMQMessage;
