import { IDatabaseConfiguration } from "../types/database";

const sql = require("mssql");

export namespace DatabaseConfiguration {
  export async function connect(config: IDatabaseConfiguration) {
    console.log(`Connecting to database ${config.database}.`);
    try {
      await new sql.connect(config);
      console.log(`Connected to database ${config.database}.`);
    } catch (error) {
      console.log(`Unable to connect - ${error}`);
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(connect(config));
        }, 5000);
      });
    }
  }
}
