import { ITopic } from "../types/topic";

const sql = require('mssql');

export namespace TopicService {
    export async function insert(topic: ITopic) {
        const { id_user, title, text, id_section } = topic;

        const request = new sql.Request();
        request.input('id_user', id_user);
        request.input('title', title);
        request.input('text', text);
        request.input('id_section', id_section);

        const result = await request.execute('usp_insert_topic');
        const returnValue = parseInt(result.returnValue);

        return {
            result: returnValue === -1 ? "error" : "succeeded",
            id: returnValue,
            errorMessage: returnValue === -1 ? "Something went wrong" : null
        }
    }
    
    export async function get(queryParams: any, id?: number) {
        const request = new sql.Request();
        const { id_section } = queryParams;

        if (id) {
            request.input('id', id);
        }
        if (id_section) {
            request.input('id_section', id_section);
        }

        const result = await request.execute('usp_get_topic');
        
        if (id) {
            return mapTopicDetails(result.recordsets);
        }
        return result.recordset;
    }

    export async function patch(props: any) {
        const { id, pinned_post } = props;

        const request = new sql.Request();
        request.input('id', id);
        request.input('pinned_post', pinned_post);

        const result = await request.execute('usp_patch_topic');

        return mapTopicDetails(result.recordsets);
    }

    function mapTopicDetails(data) {
        const posts = [];

        if (data && data.length > 1) {
            data[1].forEach(post => posts.push(post));
        }
        return { ...data[0][0], posts };
    }
}