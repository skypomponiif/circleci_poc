import { Handler } from 'aws-lambda';
import { FileNotUploadedException, RecordsNotFoundException } from './utils';
import { decryptData, encryptData, processRecords, uploadFile } from './strategy';
import { IProcessedRecords } from './interfaces';
import { constants } from './constants';
const { awsConstants } = constants;
import fakeRecords from "../fake_records.json";
import * as AWS from 'aws-sdk';

const s3 = new AWS.S3({
	accessKeyId: awsConstants.ACCESS_KEY_ID,
	secretAccessKey: awsConstants.ACCESS_KEY_SECRET,
});

const kms = new AWS.KMS({
	accessKeyId: awsConstants.ACCESS_KEY_ID,
	secretAccessKey: awsConstants.ACCESS_KEY_SECRET,
});
export const euPortabilityConsumerHandler: Handler = async (event: any, context: unknown) => {
	try {
		const records = fakeRecords.Records;
		const processedRecords: IProcessedRecords = processRecords(records);
		const fileBody = await encryptData(kms, processedRecords.valid);
		const uploaded = await uploadFile(fileBody, s3)
		console.log(`File is uploaded: ${uploaded}`);
		return uploaded;
	} catch (e) {
		console.error(e);
		if (e instanceof FileNotUploadedException) {
			// TODO: Insert logic for error handling
			return e.message;	
		} else if (e instanceof RecordsNotFoundException) {
			// TODO: Insert logic for error handling
			return e.message;
		}
		return e;
	}
};
