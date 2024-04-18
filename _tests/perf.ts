import { libsqlExecute, libsqlBatch} from "../src/main.js";
import { skjdgfksg } from "./_conf.js";

(async () => {
    const conf = skjdgfksg;
    
    console.time("libsqlBatch");
    const res = await libsqlBatch(conf, [
        {stmt: {sql: "select * from contacts where contact_id = 3;"}},
        {
            stmt: {sql: "select first_name, last_name, email from contacts where contact_id = 2;"},
            // condition: {
            //     type: "and",
            //     conds: [
            //         {type:"ok", step: 1},
            //         {type:"ok", step: 0},
            //     ]
            // }
        },
        {stmt: {sql: "select * from contacts where wife_id = ?;", args: [{type: "null"}]}}
    ]);
    console.timeEnd("libsqlBatch");
    
    console.log(res.isOk);



    console.time("libsqlExecute");
    const res2 = await libsqlExecute(conf, {sql: "select first_name, last_name, email from contacts where contact_id = 1;"});
    console.timeEnd("libsqlExecute");

    console.log(res2.isOk);
})();