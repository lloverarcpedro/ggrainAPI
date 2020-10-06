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
exports.putMQMessage = void 0;
const callback_api_1 = __importDefault(require("amqplib/callback_api"));
const putMQMessage = (message, queue) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        callback_api_1.default.connect('amqp://grainchain:gc2020bc@localhost', function (error, connection) {
            if (error) {
                throw error;
            }
            connection.createChannel(function (error1, channel) {
                if (error1) {
                    throw error1;
                }
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
            }, 500);
        });
        return 'message in rabbit';
    }
    catch (error) {
        return error.message;
    }
});
exports.putMQMessage = putMQMessage;
