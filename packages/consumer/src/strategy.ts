import { IProcessedRecords, IUploadedFileInfo } from './interfaces';
import { FileNotUploadedException, PlainTextNotEncrypted, RecordsNotFoundException } from './utils';
import * as AWS from 'aws-sdk';
import { constants } from './constants';
import { CiphertextType } from 'aws-sdk/clients/kms';

const { awsConstants } = constants;

/**
 * Process records in input from kinesis stream
 * @date 2021-11-11
 * @param {any} records:any
 * @returns {any}: IProcessedRecords
 */

export const processRecords = (records: any): IProcessedRecords => {
	if (!records) throw new RecordsNotFoundException('Records cannot be null');
	const res: IProcessedRecords = { valid: [], errors: [] };
	for (const record of records) {
		if (!record.kinesis) continue;
		const payload = Buffer.from(record.kinesis.data, 'ascii').toString();
		// TODO: Insert here validation logic
		res.valid.push(payload);
	}

	return res;
};

/**
 * Encrypt data with kmsclient
 * @date 2021-11-11
 * @param {any} records:Array<any>
 * @returns {any}
 */
 export const decryptData = (kmsClient: AWS.KMS, cipherText: CiphertextType): Promise<string> => {
	const params: AWS.KMS.Types.DecryptRequest = { KeyId: awsConstants.ENCRYPTION_KEY_ARN, CiphertextBlob: cipherText };
	return new Promise((resolve, reject) => {
		kmsClient.decrypt(params, (err: AWS.AWSError, data: AWS.KMS.DecryptResponse) => {
			if (err) reject(new PlainTextNotEncrypted(err.code));
			else if (!data.Plaintext) reject(new PlainTextNotEncrypted('No encrypted blob'));
			else resolve(data.Plaintext?.toString());
		});
	});
};
/**
 * Encrypt data with kmsclient
 * @date 2021-11-11
 * @param {any} records:Array<any>
 * @returns {any}
 */
export const encryptData = (kmsClient: AWS.KMS, records: Array<any>): Promise<CiphertextType> => {
	let res = '';
	for (const record of records) res += record;
	const params: AWS.KMS.Types.EncryptRequest = { KeyId: awsConstants.ENCRYPTION_KEY_ARN, Plaintext: res };
	return new Promise((resolve, reject) => {
		kmsClient.encrypt(params, (err: AWS.AWSError, data: AWS.KMS.EncryptResponse) => {
			if (err) reject(new PlainTextNotEncrypted(err.code));
			else if (!data.CiphertextBlob) reject(new PlainTextNotEncrypted('No encrypted blob'));
			else resolve(data.CiphertextBlob);
		});
	});
};

/**
 * Upload file to an S3 Bucket
 * @date 2021-11-11
 * @param {any} fileBody:string
 * @param {any} s3:AWS.S3
 * @returns {any}
 */
export const uploadFile = (fileBody: CiphertextType, s3: AWS.S3): Promise<IUploadedFileInfo> => {
	const params: AWS.S3.PutObjectRequest = {
		Bucket: awsConstants.BUCKET_NAME,
		Key: 'testFile.txt',
		Body: fileBody,
	};

	return new Promise((resolve, reject) => {
		s3.upload(params, (err: Error, data: AWS.S3.ManagedUpload.SendData) => {
			if (err) reject(new FileNotUploadedException(err.message));
			const res: IUploadedFileInfo = { fileLocation: data.Location, bucketName: data.Bucket, key: data.Key };
			resolve(res);
		});
	});
};
