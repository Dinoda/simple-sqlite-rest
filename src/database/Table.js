import Column from "./Column.js";

class Table {
  constructor(name, info, database) {
    ///// Basic Info /////
    this.name = name;
    this.info = info;
    this.database = database;
    this.columns = {};
    this.last_id = null;
  }

  getColumns() {
    return Object.keys(this.columns);
  }

  getColumn(name) {
    return name in this.columns ? this.columns[name] : null;
  }

  get identifier() {
    return "`" + this.info.tbl_name + "`";
  }

  get(id = null) {
    if (!id) {
      return new Promise((res, rej) => {
        this.database.connection.all(this.__select_query, (err, rows) => {
          res(rows);
        });
      });
    }
  }

  insert(data) {
    const __table = this;
    return new Promise((res, rej) => {
      const [sql, params] = this.insert_query(data);
      console.log(sql, params);
      this.database.connection.run(sql, params, function(err) {
        if (err) rej(err);
        else if (this.changes) {
          __table.__last_id = this.lastID;
          res(this.changes);
        } else {
          rej(this.changes);
        }
      });
    });
  }

  update(id, data) {
    return new Promise((res, rej) => {
      const [sql, params] = this.update_query(id, data);
      this.database.connection.run(sql, params, function(err) {
        if (err) rej(err);
        else if (this.changes) {
          res(this.changes);
        } else {
          rej(this.changes);
        }
      });
    });
  }

  delete(id) {
    return new Promise((res, rej) => {
      const [sql, params] = this.delete_query(id);
      this.database.connection.run(sql, params, function(err) {
        if (err) rej(err);
        else if (this.changes) {
          res(this.changes);
        } else {
          rej(this.changes);
        }
      });
    });
  }
}

export default Table;
