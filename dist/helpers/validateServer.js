"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function validateServer(server) {
    const requiredFields = [
        server.name,
        server.serial_number,
        server.username,
        server.miniserver,
        server.backupStatus,
        server.password,
    ];
    return requiredFields.every((field) => field === null || field === void 0 ? void 0 : field.trim());
}
exports.default = validateServer;
