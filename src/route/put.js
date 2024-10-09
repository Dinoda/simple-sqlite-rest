import db from "../database/connection.js";
import getTable from "./getTable.js";

export default (app, send) => {
  app.put("/:table/:id", (req, res) => {
    const table = getTable(req);

    table
      .update(req.params.id, req.body)
      .then(res => {
        send(res);
      })
      .catch(err => {
        send(res, null, err);
      });
  });
};
