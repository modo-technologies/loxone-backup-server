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
Object.defineProperty(exports, "__esModule", { value: true });
function createDriveFolder(folderName, drive, parentFolderId) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const rootFolder = yield drive.files.list({
                q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder'`,
                fields: "files(id)",
            });
            let folderId;
            if (((_a = rootFolder.data.files) === null || _a === void 0 ? void 0 : _a.length) === 0) {
                const response = yield drive.files.create({
                    requestBody: {
                        name: folderName,
                        mimeType: "application/vnd.google-apps.folder",
                        parents: parentFolderId ? [parentFolderId] : [],
                    },
                    fields: "id",
                });
                folderId = response.data.id;
            }
            else {
                folderId = (_b = rootFolder.data.files) === null || _b === void 0 ? void 0 : _b[0].id;
            }
            return folderId;
        }
        catch (error) {
            throw "Failed to create folder id";
        }
    });
}
exports.default = createDriveFolder;
