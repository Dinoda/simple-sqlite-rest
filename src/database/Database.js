import Table from "./Table.js";
import sqlite3 from "sqlite3";

import { init, link, sql } from "./init.js";

class Database {
  constructor(options) {
    this.connection = new sqlite3.Database(options.url);
  }

  init() {
    return new Promise((res, rej) => {
      this.tables = {};

      init(this)
        .then(db => {
          link(db)
            .then(db => {
              sql(db)
                .then(() => {
                  res();
                })
                .catch(e => {
                  rej(e);
                });
            })
            .catch(e => {
              rej(e);
            });
        })
        .catch(e => {
          rej(e);
        });
    });
  }

  getTable(name) {
    name = name.toLowerCase();
    return name in this.tables ? this.tables[name] : null;
  }

  getTableColumn(table, column) {
    return this.getTable(table)?.getColumn(column);
  }
}

export default Database;
