import { BatchReqStep, BatchStreamResOkData, Config, PipelineReq, PipelineResErr, PipelineResOk, Result, SQLStatement, StatementResOkData, StreamResErr, StreamResErrData } from "./types";

async function hranaFetch(s: {
    conf: Config,
    req_json: PipelineReq
}): Promise<Result<PipelineResOk, PipelineResErr>> {
    const res = await fetch(
        `${s.conf.db_url}/v3/pipeline`, //https://github.com/tursodatabase/libsql/blob/main/libsql-server/docs/HRANA_3_SPEC.md#execute-a-pipeline-of-requests-json
        {
            method: 'POST',
            headers: (s.conf.authToken) ? {'Authorization': 'Bearer '+s.conf.authToken} : undefined,
            body: JSON.stringify(s.req_json)
        }
    );
    if (res.ok) return {isOk: true, val: (await res.json() as PipelineResOk)};
    else return {isOk: false, err: (await (async () => {
        try {
            return await res.clone().json()
        } catch {
            return await res.text();
        }
    })() as PipelineResErr)};
}

/**
 * @async
 * @description Executes exactly one (1) SQL statements.
 * @param {Config} conf libsql's config for DB connection
 * @param {SQLStatement} stmt libsql's raw API sql statement
 * @returns {Promise<Result<StatementResOkData, StreamResErrData>>}
 */
export async function libsqlExecute(conf: Config, stmt: SQLStatement): Promise<Result<StatementResOkData, StreamResErrData|PipelineResErr>> {
    const res = await hranaFetch({conf, req_json: {
        baton: null,
        requests: [
            {
                type: "execute",
                stmt: stmt,
            },
            {
                type: "close",
            }
        ]
    }});

    if (res.isOk) {
        const resu = res.val.results[0]; //this because [0] is where we executed the statement
        if (
            resu.type=="ok" &&
            resu.response.type=="execute"
        ) return {isOk: true, val: resu.response.result};
        else return {isOk: false, err: (resu as StreamResErr).error}; //has to be StreamResErr
    }
    else return {isOk: false, err: res.err};  //PipelineResErr or StreamResErrData
}

/**
 * @async
 * @description Executes many SQL statements. Can be used to perform implicit transactions.
 * @param {Config} conf libsql's config for DB connection
 * @param {Array<BatchReqSteps>} batch_steps libsql's raw API sql batch steps
 * @returns {Promise<Result<BatchStreamResOkData, StreamResErrData>>}
 */
export async function libsqlBatch(conf: Config, batch_steps: Array<BatchReqStep>): Promise<Result<BatchStreamResOkData, StreamResErrData|PipelineResErr>> {
    const res = await hranaFetch({conf, req_json: {
        baton: null,
        requests: [
            {
                type: "batch",
                batch: { steps: batch_steps }
            },
            {
                type: "close"
            }
        ]
    }});

    if (res.isOk) {
        const resu = res.val.results[0]; //this because [0] is where we executed the statement
        if (
            resu.type=="ok" &&
            resu.response.type=="batch"
        ) return {isOk: true, val: (resu.response.result)};
        else return {isOk: false, err: (resu as StreamResErr).error}; //has to be StreamResErr
    }
    else return {isOk: false, err: res.err}; //PipelineResErr or StreamResErrData
}

/**
 * @async
 * @description Check if the server supports this library
 * @param {Config} conf libsql's config for DB connection
 * @returns {Promise<Result<null, null>>}
 */
export async function libsqlServerCompatCheck(conf: Config): Promise<Result<null, null>> {
    if ((await fetch(
        `${conf.db_url}/v3`,
        {
            method: 'GET'
        }
    )).ok) return {isOk: true, val: null};
    else return {isOk: false, err: null};
}