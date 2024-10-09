import db from "./database/connection.js";
import get from "./route/get.js";

function json(res, data = null, error = null) {
  if ("message" in error) {
    error = error.message;
  }
  res.json({
    ok: !error,
    data: data,
    error: error
  });
}

export default app => {
  get(app, json);
};
