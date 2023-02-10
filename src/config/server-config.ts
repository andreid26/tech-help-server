import { IDatabaseConfiguration } from "../types/database";
import { IServerConfiguration } from "../types/server";

const dotenv = require("dotenv");
dotenv.config();

export const config: IServerConfiguration = {
  host: "localhost",
  port: 3000,
};

export const dbConfig: IDatabaseConfiguration = {
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE,
  server: process.env.SQL_SERVER,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};
