"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlainTextNotEncrypted = exports.FileNotUploadedException = exports.RecordsNotFoundException = void 0;
class RecordsNotFoundException extends Error {
}
exports.RecordsNotFoundException = RecordsNotFoundException;
class FileNotUploadedException extends Error {
}
exports.FileNotUploadedException = FileNotUploadedException;
class PlainTextNotEncrypted extends Error {
}
exports.PlainTextNotEncrypted = PlainTextNotEncrypted;
//# sourceMappingURL=utils.js.map