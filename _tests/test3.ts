import { libsqlExecute, type libsqlSQLValue } from "../src/main.js";
import { skjdgfksg } from "./_conf.js";

(async () => {
    console.log("##libsqlExecute##")
    const res2 = await libsqlExecute(skjdgfksg, {sql: "select first_name, last_name, email from contacts where contact_id = 1;"});
    if (res2.isOk) {
        console.log(JSON.stringify(res2.val, null, 4));

        const idx = res2.val.cols.indexOf(res2.val.cols.find(c => c.name=="email")!);
        for (const row of res2.val.rows as libsqlSQLValue[][]) {
            console.log(row[idx]);
        }
    }
    else console.error(res2.err);
})();