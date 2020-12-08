const IDb = require('./interfaceDb');
class ContextStrategy extends IDb {
  constructor(database) {
    super();
    this._database = database;
  }
  static connect() {
    return this._database.connect()
  }
  isConnected() {
    return this._database.isConnected();
  }
  create(item) {
    return this._database.create(item);
  }
  read(item, skip, limit) {
    return this._database.read(item, skip, limit);
  }
  update(id, item, upsert) {
    return this._database.update(id, item, upsert);
  }
  delete(id) {
    return this._database.delete(id);
  }
}

module.exports = ContextStrategy;
