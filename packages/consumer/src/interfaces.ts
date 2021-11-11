export interface IProcessedRecords {
	valid: Array<any>;
	errors: Array<any>;
}

export interface IUploadedFileInfo {
	fileLocation?: string;
	bucketName?: string;
	key?: string;
}
