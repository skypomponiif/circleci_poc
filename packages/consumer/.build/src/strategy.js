"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = exports.encryptData = exports.decryptData = exports.processRecords = void 0;
const utils_1 = require("./utils");
const constants_1 = require("./constants");
const { awsConstants } = constants_1.constants;
/**
 * Process records in input from kinesis stream
 * @date 2021-11-11
 * @param {any} records:any
 * @returns {any}: IProcessedRecords
 */
const processRecords = (records) => {
    if (!records)
        throw new utils_1.RecordsNotFoundException('Records cannot be null');
    const res = { valid: [], errors: [] };
    for (const record of records) {
        if (!record.kinesis)
            continue;
        const payload = Buffer.from(record.kinesis.data, 'ascii').toString();
        // TODO: Insert here validation logic
        res.valid.push(payload);
    }
    return res;
};
exports.processRecords = processRecords;
/**
 * Encrypt data with kmsclient
 * @date 2021-11-11
 * @param {any} records:Array<any>
 * @returns {any}
 */
const decryptData = (kmsClient, cipherText) => {
    const params = { KeyId: awsConstants.ENCRYPTION_KEY_ARN, CiphertextBlob: cipherText };
    return new Promise((resolve, reject) => {
        kmsClient.decrypt(params, (err, data) => {
            if (err)
                reject(new utils_1.PlainTextNotEncrypted(err.code));
            else if (!data.Plaintext)
                reject(new utils_1.PlainTextNotEncrypted('No encrypted blob'));
            else
                resolve(data.Plaintext?.toString());
        });
    });
};
exports.decryptData = decryptData;
/**
 * Encrypt data with kmsclient
 * @date 2021-11-11
 * @param {any} records:Array<any>
 * @returns {any}
 */
const encryptData = (kmsClient, records) => {
    let res = '';
    for (const record of records)
        res += record;
    const params = { KeyId: awsConstants.ENCRYPTION_KEY_ARN, Plaintext: res };
    return new Promise((resolve, reject) => {
        kmsClient.encrypt(params, (err, data) => {
            if (err)
                reject(new utils_1.PlainTextNotEncrypted(err.code));
            else if (!data.CiphertextBlob)
                reject(new utils_1.PlainTextNotEncrypted('No encrypted blob'));
            else
                resolve(data.CiphertextBlob);
        });
    });
};
exports.encryptData = encryptData;
/**
 * Upload file to an S3 Bucket
 * @date 2021-11-11
 * @param {any} fileBody:string
 * @param {any} s3:AWS.S3
 * @returns {any}
 */
const uploadFile = (fileBody, s3) => {
    const params = {
        Bucket: awsConstants.BUCKET_NAME,
        Key: 'testFile.txt',
        Body: fileBody,
    };
    return new Promise((resolve, reject) => {
        s3.upload(params, (err, data) => {
            if (err)
                reject(new utils_1.FileNotUploadedException(err.message));
            const res = { fileLocation: data.Location, bucketName: data.Bucket, key: data.Key };
            resolve(res);
        });
    });
};
exports.uploadFile = uploadFile;
//# sourceMappingURL=strategy.js.map