function sql(database) {
  return new Promise((res, rej) => {
    for (const table of Object.keys(database.tables)) {
      select_sql(database, database.tables[table]);
      insert_sql(database, database.tables[table]);
      update_sql(database, database.tables[table]);
      delete_sql(database, database.tables[table]);
    }

    res(database);
  });
}

function select_sql(database, table) {
  table.__select_query = "SELECT * FROM " + table.identifier;
}

function insert_sql(database, table) {
  table.__insert_query =
    "INSERT INTO " + table.identifier + "(:h:) VALUES (:v:)";
  table.insert_query = data => {
    const toInsert = {};
    for (const colname of table.getColumns()) {
      const column = table.columns[colname];

      if (data.hasOwnProperty(colname)) {
        // TODO : Ensure the data matches the expected type if given
        toInsert[column.identifier] = data[colname];
      } else if (!column.__nullable) {
        throw new Error(
          "Data for column '" +
            colname +
            "' expected in table '" +
            table.name +
            "'"
        );
      }
    }

    return [
      table.__insert_query
        .replace(
          ":h:",
          Object.keys(toInsert)
            .map(k => k)
            .join(", ")
        )
        .replace(
          ":v:",
          Object.keys(toInsert)
            .map(() => "?")
            .join(", ")
        ),
      Object.values(toInsert)
    ];
  };
}

function update_sql(database, table) {
  table.__update_query =
    "UPDATE " +
    table.identifier +
    " SET :v: WHERE " +
    table.__primary_key.full_identifier +
    " = ?";

  table.update_query = (id, data) => {
    console.log(table.__update_query);
    const toUpdate = {};

    for (const colname of table.getColumns()) {
      const column = table.columns[colname];

      if (data.hasOwnProperty(colname)) {
        // TODO : Same as for INSERT
        toUpdate[column.identifier] = data[colname];
      }
    }
    console.log(
      table.__update_query.replace(
        ":v:",
        Object.keys(toUpdate)
          .map(k => {
            return k + " = ?";
          })
          .join(", ")
      )
    );

    return [
      table.__update_query.replace(
        ":v:",
        Object.keys(toUpdate)
          .map(k => {
            return k + " = ?";
          })
          .join(", ")
      ),
      [...Object.values(toUpdate), id]
    ];
  };
}

function delete_sql(database, table) {
  table.__delete_query = 'DELETE FROM ' + table.identifier + ' WHERE ' + table.__primary_key.identifier + ' = ?';

  table.delete_query = (id) => {
    return [
      table.__delete_query,
      [id]
    ];
  };
}

export default sql;
