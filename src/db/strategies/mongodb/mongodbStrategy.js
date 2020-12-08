const IDb = require('../base/interfaceDb');
const Mongoose = require('mongoose')

const STATUS = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
  99: 'uninitialized',
}

class MongoDBStrategy extends IDb {
  constructor(connection, schema) {
    super();
    this._connection = connection;
    this._schema = schema;
  }
  async isConnected() {
    const state = STATUS[this._connection.readyState]
    if (state !== 'connecting')
      return STATUS[this._connection.readyState]

    await new Promise((promisse) => setTimeout(promisse, 3000));
    return STATUS[this._connection.readyState]
  }
  static connect() {
    Mongoose.connect(process.env.CONNECTION_STRING_MONGO,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }, (error) => {
        if (!error) return;
        console.log('Falha na conexão', error)
      })
    const connection = Mongoose.connection
    return connection;
  }
  async create(item) {
    try {
      return await this._schema.create(item)
    } catch (error) {
      console.error('error', error)
      return false;
    }
  }
  async read(item = {}, skip = 0, limit = 10) {
    return await
      this._schema
        .find(item)
        .skip(skip)
        .limit(limit)
  }
  async update(id = {}, item = {}) {
    return await this._schema.updateOne({ _id: id }, { $set: item })
  }
  async delete(id) {
    const query = id ? { _id: id } : {}
    return this._schema.deleteOne(query)
  }
}

module.exports = MongoDBStrategy;
