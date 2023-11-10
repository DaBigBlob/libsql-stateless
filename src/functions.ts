import { libsqlBatchReqStep, libsqlBatchStreamResOkData, libsqlConfig, libsqlPipelineReq, libsqlPipelineResErr, libsqlPipelineResOk, libsqlResult, libsqlSQLStatement, libsqlStatementResOkData, libsqlStreamResErr, libsqlStreamResErrData } from "./types";

async function hranaFetch(s: {
    conf: libsqlConfig,
    req_json: libsqlPipelineReq
}): Promise<libsqlResult<libsqlPipelineResOk, libsqlPipelineResErr>> {
    const res = await fetch(
        `${s.conf.db_url}/v3/pipeline`, //https://github.com/tursodatabase/libsql/blob/main/libsql-server/docs/HRANA_3_SPEC.md#execute-a-pipeline-of-requests-json
        {
            method: 'POST',
            headers: (s.conf.authToken) ? {'Authorization': 'Bearer '+s.conf.authToken} : undefined,
            body: JSON.stringify(s.req_json)
        }
    );
    if (res.ok) return {isOk: true, val: (await res.json() as libsqlPipelineResOk)};
    else return {isOk: false, err: (await (async () => {
        try {
            return await res.clone().json()
        } catch {
            return await res.text();
        }
    })() as libsqlPipelineResErr)};
}

/**
 * @async
 * @description Executes exactly one (1) SQL statements.
 * @param {libsqlConfig} conf libsql's config for DB connection {@link libsqlConfig}
 * @param {libsqlSQLStatement} stmt libsql's raw API sql statement {@link libsqlSQLStatement}
 */
export async function libsqlExecute(conf: libsqlConfig, stmt: libsqlSQLStatement): Promise<libsqlResult<libsqlStatementResOkData, libsqlStreamResErrData|libsqlPipelineResErr>> {
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
        else return {isOk: false, err: (resu as libsqlStreamResErr).error}; //has to be StreamResErr
    }
    else return {isOk: false, err: res.err};  //PipelineResErr or StreamResErrData
}

/**
 * @async
 * @description Executes many SQL statements. Can be used to perform implicit transactions.
 * @param {libsqlConfig} conf libsql's config for DB connection {@link libsqlConfig}
 * @param {Array<BatchReqSteps>} batch_steps array of libsql's raw API sql batch steps {@link BatchReqSteps}
 */
export async function libsqlBatch(conf: libsqlConfig, batch_steps: Array<libsqlBatchReqStep>): Promise<libsqlResult<libsqlBatchStreamResOkData, libsqlStreamResErrData|libsqlPipelineResErr>> {
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
        else return {isOk: false, err: (resu as libsqlStreamResErr).error}; //has to be StreamResErr
    }
    else return {isOk: false, err: res.err}; //PipelineResErr or StreamResErrData
}

/**
 * @async
 * @description Check if the server supports this library
 * @param {Config} conf libsql's config for DB connection {@link libsqlConfig}
 */
export async function libsqlServerCompatCheck(conf: libsqlConfig): Promise<libsqlResult<null, null>> {
    if ((await fetch(
        `${conf.db_url}/v3`,
        {
            method: 'GET'
        }
    )).ok) return {isOk: true, val: null};
    else return {isOk: false, err: null};
}