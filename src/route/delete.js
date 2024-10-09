import db from "../database/connection.js";
import getTable from "./getTable.js";

export default (app, send) => {
  app.put("/:table/:id", (req, res) => {
    const table = getTable(req);

    table
      .delete(req.params.id)
      .then(res => {
        send(res);
      })
      .catch(err => {
        send(res, null, err);
      });
  });
};
