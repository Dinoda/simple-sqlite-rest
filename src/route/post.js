import db from "../database/connection.js";

function getTable(req) {
  return db.getTable(req.params.table);
}

export default (app, send) => {
  app.post("/:table", (req, res) => {
    const table = getTable(req);

    table
      .post(req.body)
      .then(res => {
        send(res);
      })
      .catch(err => {
        send(res, null, err);
      });
  });
};
