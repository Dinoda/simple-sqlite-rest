class Column {
  constructor(name, info, table) {
    ///// Basic Info /////
    this.name = name;
    this.info = info;
    this.table = table;
    this.database = this.table.database;

    ///// Meta Info /////
    this.__column_alias = this.name
    this.__column_name = '`' + this.name + '`';
    this.__col_id = this.info.cid;
    this.__nullable = !this.info.notnull;
    this.__primary = this.info.pk == 1;
    this.__default = this.info.dflt_value;
    this.__type = this.info.type;
    this.__references = null;
    this.__referencedBy = [];

    ///// Children /////
  }

  get identifier() {
    return "`" + this.name + "`";
  }

  get full_identifier() {
    return this.table.identifier + "." + this.identifier;
  }

  checkColumn(col) {
    if (!(col instanceof Column)) {
      throw new Error(
        "This should be an instance of Column, got " + typeof col
      );
    }
  }

  references(col) {
    this.checkColumn(col);

    if (this.__references !== null) {
      throw new Error("A column can't references multiple elements, already referencing " + this.__references.name + " of table " + this.__references.table.name);
    }

    this.__references = col;

    this.__references.isReferencedBy(this);
  }

  isReferencedBy(col) {
    this.checkColumn(col);

    this.__referencedBy.push(col);
  }
}

export default Column;
