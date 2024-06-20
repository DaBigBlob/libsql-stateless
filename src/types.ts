//### Resul type
export type libsqlResult<T, E> = { isOk: true, val: T}|{ isOk: false, err: E};

//### Config Type
export type libsqlConfig = {
    db_url: string,
    authToken?: string,
    fetch?: typeof fetch
}

//### Error Type
//the final wrapper for error in this library for what is returned by hrana server
export type libsqlError = {
    kind: "LIBSQL_SERVER_ERROR",
    server_message: string|null,
    http_status_code: number
}|{
    kind: "LIBSQL_RESPONSE_ERROR",
    data: libsqlStreamResErrData
}

//### Hrana Types
// "//line:" from 1713449025236-HRANA_3_SPEC.md
//## Pipeline Intractions ======================================================
//line: 652
export type libsqlPipelineReq = {
    baton: string | null,
    requests: Array<libsqlCloseStreamReq|libsqlExecuteStreamReq|libsqlBatchStreamReq>
}
//line: 657
export type libsqlPipelineRes = {
    baton: string | null,
    base_url: string | null,
    results: Array<libsqlStreamResOk|libsqlStreamResErr>
}

//## StreamReqKind =============================================================
//line: 792
export type libsqlCloseStreamReq = {
    type: "close",
}
//line: 809
export type libsqlExecuteStreamReq = {
    type: "execute",
    stmt: libsqlSQLStatement
}
//line: 828
export type libsqlBatchStreamReq = {
    type: "batch",
    // line: 1059
    batch: {
        steps: Array<libsqlBatchReqStep>,
    }
}
//other types are not dealt with in this lib

//## StreamResKind =============================================================
//line: 667
export type libsqlStreamResOk = {
    type: "ok",
    response:  libsqlCloseStreamResOk|libsqlExecuteStreamResOk|libsqlBatchStreamResOk
}
//line: 672
export type libsqlStreamResErr = {
    type: "error",
    error: libsqlStreamResErrData
}

//## SQLStatement ==============================================================
//line: 978
export type libsqlSQLStatement = {
    sql: string,
    // sql_id: number | null, // not useful in stateless
    args?: Array<libsqlSQLValue>,
    named_args?: Array<{
        name: string,
        value: libsqlSQLValue,
    }>,
    want_rows?: boolean,
}

//## BatchReqSteps =============================================================
// line: 1063
export type libsqlBatchReqStep = {
    condition?: libsqlBatchReqStepExecCond | null,
    stmt: libsqlSQLStatement,
}

//## Stream Res Ok Kinds =======================================================
//line: 796
export type libsqlCloseStreamResOk = {
    type: "close",
}
//line: 814
export type libsqlExecuteStreamResOk = {
    type: "execute",
    result: libsqlStatementResOkData
}
//line: 833
export type libsqlBatchStreamResOk = {
    type: "batch",
    result: libsqlBatchStreamResOkData,
}
//other types are not dealt with in this lib

//## StreamResErrData ==========================================================
// line: 959
export type libsqlStreamResErrData = {
    message: string,
    code?: string | null
}

//## SQLValues =================================================================
// line: 1266
export type libsqlSQLValue = 
    { type: "null" } |
    { type: "integer", value: string } |
    { type: "float", value: number } |
    { type: "text", value: string } |
    { type: "blob", base64: string };

//## BatchReqStepExecCond ======================================================
// line: 1078
export type libsqlBatchReqStepExecCond = 
    { type: "ok", step: number } | //uint32: 0-based index in the steps array
    { type: "error", step: number } | //uint32: 0-based index in the steps array
    { type: "not", cond: libsqlBatchReqStepExecCond } |
    { type: "and", conds: Array<libsqlBatchReqStepExecCond> } |
    { type: "or", conds: Array<libsqlBatchReqStepExecCond> } |
    { type: "is_autocommit" };

//## StatementResOkData ========================================================
//line: 1024
export type libsqlStatementResOkData = {
    cols: Array<libsqlSQLColumnElm>,
    rows: Array<Array<libsqlSQLValue>>,
    affected_row_count: number, //uint32
    last_insert_rowid: string | null,
    rows_read: number,
    rows_written: number,
    query_duration_ms: number
}

//## BatchStreamResOkData ======================================================
//line: 1106
export type libsqlBatchStreamResOkData = {
    step_results: Array<libsqlStatementResOkData | null>,
    step_errors: Array<libsqlStreamResErrData | null>
}

//## SQLColumn =================================================================
// line: 1034
export type libsqlSQLColumnElm = {
    name: string | null,
    decltype: string | null
}