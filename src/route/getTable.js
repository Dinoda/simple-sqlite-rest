export default function getTable(req) {
  return db.getTable(req.params.table);
}
