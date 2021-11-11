import { IProcessedRecords, IUploadedFileInfo } from './interfaces';
import * as AWS from 'aws-sdk';
import { CiphertextType } from 'aws-sdk/clients/kms';
/**
 * Process records in input from kinesis stream
 * @date 2021-11-11
 * @param {any} records:any
 * @returns {any}: IProcessedRecords
 */
export declare const processRecords: (records: any) => IProcessedRecords;
/**
 * Encrypt data with kmsclient
 * @date 2021-11-11
 * @param {any} records:Array<any>
 * @returns {any}
 */
export declare const decryptData: (kmsClient: AWS.KMS, cipherText: CiphertextType) => Promise<string>;
/**
 * Encrypt data with kmsclient
 * @date 2021-11-11
 * @param {any} records:Array<any>
 * @returns {any}
 */
export declare const encryptData: (kmsClient: AWS.KMS, records: Array<any>) => Promise<CiphertextType>;
/**
 * Upload file to an S3 Bucket
 * @date 2021-11-11
 * @param {any} fileBody:string
 * @param {any} s3:AWS.S3
 * @returns {any}
 */
export declare const uploadFile: (fileBody: CiphertextType, s3: AWS.S3) => Promise<IUploadedFileInfo>;
