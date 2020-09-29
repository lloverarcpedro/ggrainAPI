"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const users_routes_1 = __importDefault(require("./users-routes"));
const cc_routes_1 = __importDefault(require("./cc-routes"));
const grainchain_routes_1 = __importDefault(require("./grainchain-routes"));
const load_routes_1 = __importDefault(require("./load-routes"));
exports.default = (app) => {
    app.use('/api/users', users_routes_1.default);
    app.use('/api/cc', cc_routes_1.default);
    app.use('/api/grainchain', grainchain_routes_1.default);
    app.use('/api/loads', load_routes_1.default);
};
