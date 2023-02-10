import { IPost } from "../types/post";

const sql = require('mssql');

export namespace PostService {
    export async function insert(post: IPost) {
        const { id_user, id_topic, text } = post;

        const request = new sql.Request();
        request.input('id_user', id_user);
        request.input('id_topic', id_topic);
        request.input('text', text);

        const result = await request.execute('usp_insert_post');
        const returnValue = parseInt(result.returnValue);

        return {
            result: returnValue === -1 ? "error" : "succeeded",
            id: returnValue,
            errorMessage: returnValue === -1 ? "Something went wrong" : null
        }
    }
}