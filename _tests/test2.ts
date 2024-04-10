import { libsqlExecute, libsqlBatch, libsqlServerCompatCheck, libsqlSQLValue} from "../src/main";
import { skjdgfksg } from "./_conf";

(async () => {
    const conf = skjdgfksg;

    const res = await libsqlBatch(conf, [
        //{stmt: {sql: "BEGIN DEFERRED"}},
        {stmt: {sql: "select * from contacts where contact_id = ?;", args: [{type: "integer", value: "3"}]}},
        {stmt: {sql: "select first_name, last_name, email from contacts where contact_id = 2;"}},
        {stmt: {sql: `insert into contacts (contact_id,first_name,last_name,email,phone) values (6,"glomm","feru","moca@doro.co","001");`}},
        {stmt: {sql: `delete from contacts where contact_id = 6;`}}
    ]);
    if (res.isOk) console.log(JSON.stringify(res.val.step_results.map(r => {
        if (!r) return undefined;
        if (r.rows.length===0) return r;
        else return r.rows;
    }), null, 4));
    else console.error(res.err);

    const resb = await libsqlBatch(conf, [
        {stmt: {sql: "BEGIN DEFERRED"}},
        {stmt: {sql: "select * from contacts where contact_id = ?;", args: [{type: "integer", value: "3"}]},
            condition: {type: "and", conds: [
                {type: "ok", step: 0},
                {type: "not", cond: {type: "is_autocommit"}}
            ]}
        },
        {stmt: {sql: "select first_name, last_name, email from contacts where contact_id = 2;"},
            condition: {type: "and", conds: [
                {type: "ok", step: 1},
                {type: "not", cond: {type: "is_autocommit"}}
            ]}
        },
        {stmt: {sql: `insert into contacts (contact_id,first_name,last_name,email,phone) values (7,"glomm","feru","moca@doro.co","001");`},
            condition: {type: "and", conds: [
                {type: "ok", step: 2},
                {type: "not", cond: {type: "is_autocommit"}}
            ]}
        },
        {stmt: {sql: `delete from contacts where contact_id = 7;`},
            condition: {type: "and", conds: [
                {type: "ok", step: 3},
                {type: "not", cond: {type: "is_autocommit"}}
            ]}
        },
        {stmt: {sql: "COMMIT"}},
        {stmt: {sql: "ROLLBACK"}, condition: {type: "not", cond: {type: "ok", step: 5}}}
    ]);
    if (resb.isOk) console.log(JSON.stringify(resb.val.step_results.map(r => {
        if (!r) return undefined;
        if (r.rows.length===0) return r;
        else return r.rows;
    }), null, 4));
    else console.error(resb.err);


    const res2 = await libsqlExecute(conf, {sql: "select first_name, last_name, email from contacts where contact_id = 1;"});
    if (res2.isOk) {
        console.log(JSON.stringify(res2.val, null, 4));

        const idx = res2.val.cols.indexOf(res2.val.cols.find(c => c.name=="email")!);
        for (const row of res2.val.rows as libsqlSQLValue[][]) {
            console.log(row[idx]);
        }
    }
    else console.error(res2.err);

    const res4 = await libsqlExecute(conf, {sql: "select first_name, last_name, email from contacts where contact_id = 1;"});
    if (res4.isOk) {
    }
    else console.error(res4.err);



    const res3 = await libsqlServerCompatCheck(conf);
    if (res3.isOk) console.log("Server Compat Check OK");
    else console.error("Server Compat Check NOT OK");
})();