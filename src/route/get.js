import db from "../database/connection.js";

export default (app, send) => {
  app.get("/list", (req, res) => {
    const list = Object.keys(db.tables);

    send(res, list);
  });

  app.get("/:table/:id", (req, res) => {
    send(res, null, "Not implemented yet");
  });

  app.get("/:table", (req, res) => {
    const name = req.params.table;
    const table = db.getTable(name);

    if (!table) {
      send(res, null, "Could't find table \"" + req.table + '"');
      return;
    }

    table
      .get()
      .then(result => {
        send(res, result);
      })
      .catch(err => {
        send(res, null, err);
      });
  });
};
