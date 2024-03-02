"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function generateFileName(serverName) {
    const now = new Date();
    const fileName = now
        .toISOString()
        .replace(/[T:.-]/g, "_")
        .slice(0, -5);
    return `${serverName}_${fileName}`;
}
exports.default = generateFileName;
