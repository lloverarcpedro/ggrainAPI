"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mqconnect = void 0;
const callback_api_1 = __importDefault(require("amqplib/callback_api"));
const mqconnect = (message) => {
    callback_api_1.default.credentials.plain('username', 'mypass');
    const mqconnect = callback_api_1.default.connect('amqp://localhost', function (error, connection) {
        if (error) {
            console.log(error.message);
            throw error;
        }
        connection.createChannel(function (error1, channel) {
            if (error1) {
                console.log('error1');
                throw error1;
            }
            const queue = 'node_queue';
            channel.assertQueue(queue, {
                durable: true
            });
            channel.sendToQueue(queue, Buffer.from(message), {
                persistent: true
            });
            console.log(`'Sent: ${message}`);
        });
        setTimeout(function () {
            connection.close();
            process.exit(0);
        }, 500);
    });
    return mqconnect;
};
exports.mqconnect = mqconnect;
