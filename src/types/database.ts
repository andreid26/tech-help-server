export interface IDatabaseConfiguration {
    user: string;
    password: string;
    database: string;
    server: string;
    options: IDbConfigOptions;
}

interface IDbConfigOptions {
    encrypt: boolean;
    trustServerCertificate: boolean;
}