const foreignKeyRegex = /FOREIGN KEY \((\S+)\) REFERENCES ([^\(]+)\(([^\)]+)\)/g;

function link(database) {
  return new Promise((res, rej) => {
    const proms = [];
    for (const table of Object.keys(database.tables)) {
      proms.push(link_primary(database, database.tables[table]));
      proms.push(link_foreign_keys(database, database.tables[table]));
      proms.push(link_auto_increment(database, database.tables[table]));
    }

    Promise.all(proms).then(() => {
      res(database);
    });
  });
}

function link_primary(database, table) {
  return new Promise((res, rej) => {
    for (const colname of table.getColumns()) {
      const column = table.columns[colname];

      if (column.__primary) {
        table.__primary_key = column;
        res();
      }
    }

    rej();
  });
}

function link_foreign_keys(database, table) {
  const sql = table.info.sql;
  return new Promise((res, rej) => {
    let match = foreignKeyRegex.exec(sql);
    while (match) {
      const [_, col, target_table, target_col] = match;

      table.columns[col].references(
        database.getTableColumn(target_table, target_col)
      );

      match = foreignKeyRegex.exec(sql);
    }

    res();
  });
}

function link_auto_increment(database, table) {
  const sql = table.info.sql;

  return new Promise((res, rej) => {
    //console.log('Not in pragma...');
    res();
  });
}

export default link;
