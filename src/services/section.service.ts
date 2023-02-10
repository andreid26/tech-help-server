const sql = require('mssql');

export namespace SectionService {

    export async function get(id?: number) {
        const request = new sql.Request();

        if (id) {
            request.input('id', id);
        }

        const result = await request.execute('usp_get_section');
        return result.recordset;
    }
}