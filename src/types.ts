//### Resul type
export type libsqlResult<T, E> = { isOk: true, val: T}|{ isOk: false, err: E};

//### Config Type
export type libsqlConfig = {
    db_url: string,
    authToken?: string
}

//### Hrana Types
//url: https://github.com/tursodatabase/libsql/blob/main/libsql-server/docs/HRANA_3_SPEC.md#hrana-over-http
//## Pipeline Intractions ======================================================
export type libsqlPipelineReq = {
    baton: string | null,
    requests: Array<libsqlCloseStreamReq|libsqlExecuteStreamReq|libsqlBatchStreamReq>
}
export type libsqlPipelineResOk = {
    baton: string | null,
    base_url: string | null,
    results: Array<libsqlStreamResOk|libsqlStreamResErr>
}
export type libsqlPipelineResErr = string|{
    error: string
}

//## StreamReqKind =============================================================
export type libsqlCloseStreamReq = {
    type: "close",
}
export type libsqlExecuteStreamReq = {
    type: "execute",
    stmt: libsqlSQLStatement
}
export type libsqlBatchStreamReq = {
    type: "batch",
    batch: {
        steps: Array<libsqlBatchReqStep>,
    }
}
//other types are not dealt with in this lib

//## StreamResKind =============================================================
export type libsqlStreamResOk = {
    type: "ok",
    response:  libsqlCloseStreamResOk|libsqlExecuteStreamResOk|libsqlBatchStreamResOk
}
export type libsqlStreamResErr = {
    type: "error",
    error: libsqlStreamResErrData
}

//## SQLStatement ==============================================================
export type libsqlSQLStatement = {
    sql: string,
    args?: Array<libsqlSQLValue>,
    named_args?: Array<{
        name: string,
        value: libsqlSQLValue,
    }>,
    want_rows?: boolean,
}

//## BatchReqSteps =============================================================
export type libsqlBatchReqStep = {
    condition?: libsqlBatchReqStepExecCond | null,
    stmt: libsqlSQLStatement,
}

//## Stream Res Ok Kinds =======================================================
export type libsqlCloseStreamResOk = {
    type: "close",
}
export type libsqlExecuteStreamResOk = {
    type: "execute",
    result: libsqlStatementResOkData
}
export type libsqlBatchStreamResOk = {
    type: "batch",
    result: libsqlBatchStreamResOkData,
}
//other types are not dealt with in this lib

//## StreamResErrData ==========================================================
export type libsqlStreamResErrData = {
    message: string,
    code?: string | null
}

//## SQLValues =================================================================
export type libsqlSQLValue = 
    { type: "null" } |
    { type: "integer", value: string } |
    { type: "float", value: number } |
    { type: "text", value: string } |
    { type: "blob", base64: string };

//## BatchReqStepExecCond ======================================================
export type libsqlBatchReqStepExecCond = 
    { type: "ok", step: number } | //uint32: 0-based index in the steps array
    { type: "error", step: number } | //uint32: 0-based index in the steps array
    { type: "not", cond: libsqlBatchReqStepExecCond } |
    { type: "and", conds: Array<libsqlBatchReqStepExecCond> } |
    { type: "or", conds: Array<libsqlBatchReqStepExecCond> } |
    { type: "is_autocommit" };

//## StatementResOkData ========================================================
export type libsqlStatementResOkData = {
    cols: Array<libsqlSQLColumnElm>,
    rows: Array<Array<libsqlSQLValue>>,
    affected_row_count: number, //uint32
    last_insert_rowid: string | null
}

//## BatchStreamResOkData ======================================================
export type libsqlBatchStreamResOkData = {
    step_results: Array<libsqlStatementResOkData | null>,
    step_errors: Array<libsqlStreamResErrData | null>
}

//## SQLColumn =================================================================
export type libsqlSQLColumnElm = {
    name: string | null,
    decltype: string | null
}