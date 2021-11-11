"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.euPortabilityConsumerHandler = void 0;
const utils_1 = require("./utils");
const strategy_1 = require("./strategy");
const constants_1 = require("./constants");
const { awsConstants } = constants_1.constants;
const fake_records_json_1 = __importDefault(require("../fake_records.json"));
const AWS = __importStar(require("aws-sdk"));
const s3 = new AWS.S3({
    accessKeyId: awsConstants.ACCESS_KEY_ID,
    secretAccessKey: awsConstants.ACCESS_KEY_SECRET,
});
const kms = new AWS.KMS({
    accessKeyId: awsConstants.ACCESS_KEY_ID,
    secretAccessKey: awsConstants.ACCESS_KEY_SECRET,
});
const euPortabilityConsumerHandler = async (event, context) => {
    try {
        const records = fake_records_json_1.default.Records;
        const processedRecords = (0, strategy_1.processRecords)(records);
        const fileBody = await (0, strategy_1.encryptData)(kms, processedRecords.valid);
        const uploaded = await (0, strategy_1.uploadFile)(fileBody, s3);
        const decrypted = await (0, strategy_1.decryptData)(kms, fileBody);
        console.log(`File is uploaded: ${uploaded}`);
        return uploaded;
    }
    catch (e) {
        console.error(e);
        if (e instanceof utils_1.FileNotUploadedException) {
            // TODO: Insert logic for error handling
            return e.message;
        }
        else if (e instanceof utils_1.RecordsNotFoundException) {
            // TODO: Insert logic for error handling
            return e.message;
        }
        return e;
    }
};
exports.euPortabilityConsumerHandler = euPortabilityConsumerHandler;
//# sourceMappingURL=handler.js.map