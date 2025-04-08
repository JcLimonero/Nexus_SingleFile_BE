"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.credentials = void 0;
exports.credentials = {
    database: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306', 10),
        username: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || '00@Limonero',
        database: process.env.DB_DATABASE || 'nqt_db_test',
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'test-secret-key',
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    },
};
//# sourceMappingURL=credentials.js.map