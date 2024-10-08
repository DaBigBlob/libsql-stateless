import type { libsqlBatchReqStep, libsqlBatchStreamResOk, libsqlBatchStreamResOkData, libsqlConfig, libsqlError, libsqlExecuteStreamResOk, libsqlFetchLike, libsqlPipelineReq, libsqlPipelineRes, libsqlResult, libsqlSQLStatement, libsqlStatementResOkData } from "./types.js";

async function hranaFetch(s: {
    conf: libsqlConfig,
    req_json: libsqlPipelineReq
}): Promise<libsqlResult<libsqlPipelineRes, libsqlError>> {
    const res = await (s.conf.fetch ?? (globalThis as unknown as {fetch: libsqlFetchLike}).fetch)(
        `${s.conf.url}/v3/pipeline`, //line 646 from 1713449025236-HRANA_3_SPEC.md
        {
            method: 'POST',
            headers: (s.conf.authToken) ? {'Authorization': 'Bearer '+s.conf.authToken} : undefined,
            body: JSON.stringify(s.req_json)
        }
    );
    if (res.ok) return {isOk: true, val: (await res.json() as libsqlPipelineRes)};
    else return {isOk: false, err: {
        kind: "LIBSQL_SERVER_ERROR",
        server_message: await (async () => {
            try {
                return await res.text()
            } catch {
                return null;
            }
        })(),
        http_status_code: res.status
    }};
}

/**
 * @async
 * @description Executes exactly one (1) SQL statements.
 * @param {libsqlConfig} conf libsql's config for DB connection: {@link libsqlConfig}
 * @param {libsqlSQLStatement} stmt libsql's raw API sql statement: {@link libsqlSQLStatement}
 */
export async function libsqlExecute(conf: libsqlConfig, stmt: libsqlSQLStatement): Promise<libsqlResult<libsqlStatementResOkData, libsqlError>> {
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
        if (resu.type=="ok") return {
            isOk: true,
            val: (resu.response as libsqlExecuteStreamResOk).result // cast because is guaranteed to be execute by line: 699
        };
        else return {isOk: false, err: {
            kind: "LIBSQL_RESPONSE_ERROR",
            data: resu.error //has to be StreamResErr
        }};
    }
    else return res;  //whatever server error returned
}

/**
 * @async
 * @description Executes many SQL statements. Can be used to perform implicit transactions.
 * @param {libsqlConfig} conf libsql's config for DB connection: {@link libsqlConfig}
 * @param {Array<BatchReqSteps>} batch_steps array of libsql's raw API sql batch steps: {@link BatchReqSteps}
 */
export async function libsqlBatch(conf: libsqlConfig, batch_steps: Array<libsqlBatchReqStep>): Promise<libsqlResult<libsqlBatchStreamResOkData, libsqlError>> {
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
        if (resu.type=="ok") return {
            isOk: true,
            val: (resu.response as libsqlBatchStreamResOk).result // cast because is guaranteed to be execute by line: 1070
        };
        else return {isOk: false, err: {
            kind: "LIBSQL_RESPONSE_ERROR",
            data: resu.error //has to be StreamResErr
        }};
    }
    else return res; //whatever server error returned
}

/**
 * @async
 * @description Check if the server supports this library
 * @param {Config} conf libsql's config for DB connection: {@link libsqlConfig}
 */
export async function libsqlServerCompatCheck(conf: libsqlConfig): Promise<libsqlResult<null, null>> {
    if ((await (conf.fetch ?? (globalThis as unknown as {fetch: libsqlFetchLike}).fetch)(
        `${conf.url}/v3`,
        {
            method: 'GET'
        }
    )).ok) return {isOk: true, val: null};
    else return {isOk: false, err: null};
}