import Table from "../Table.js";
import Column from "../Column.js";

const tables_select = "SELECT * FROM sqlite_master WHERE type = 'table'";
const table_pragma = "PRAGMA table_info(:::)";

function init(database) {
  return new Promise((res, rej) => {
    database.connection.all(tables_select, (err, rows) => {
      const proms = [];
      for (const table of rows) {
        proms.push(table_init(database, table));
      }

      Promise.all(proms)
        .then(() => {
          res(database);
        })
        .catch(e => {
          rej(e);
        });
    });
  });
}

function table_init(database, tbl_info) {
  return new Promise((res, rej) => {
    const table = new Table(tbl_info.tbl_name, tbl_info, database);
    const tbl_nm = tbl_info.tbl_name.toLowerCase();

    database.tables[tbl_nm] = table;

    database.connection.all(
      table_pragma.replace(":::", tbl_info.tbl_name),
      (err, rows) => {
        for (const col of rows) {
          table.columns[col.name] = new Column(col.name, col, table);
        }

        res();
      }
    );
  });
}

export default init;
