const IDb = require('./../base/interfaceDb');
const Sequelize = require('sequelize');

class PostgresStrategy extends IDb {
  constructor(connection, schema) {
    super();
    this._connection = connection;
    this._schema = schema;
  }
  async isConnected() {
    try {
      await this._connection.authenticate()
      return true;
    } catch (error) {
      console.error('erro', error)
    }
  }
  static async defineModule(connection, schema) {
    return await connection.define(schema.name, schema.schema, schema.options).sync()
  }
  static connect() {
    const connection = new Sequelize(
      process.env.CONNECTION_STRING_POSTGRES, {
      operatorsAliases: false,
      logging: false,
      quoteIdentifiers: false,
      ssl: process.env.SSL_DB
    })
    return connection
  }
  async create(item) {
    const { dataValues } = await this._schema.create(item)
    return dataValues
  }
  async read(item = {}) {
    const result = await this._schema.findAll({
      where: item,
      raw: true
    })
    return result
  }
  async update(id = {}, item = {}, upsert = false) {
    const fn = upsert ? 'upsert' : 'update'

    return await this._schema[fn](item, {
      where:
      {
        id: id
      },
      raw: true
    })
  }
  async delete(id) {
    const query = id ? { id } : {}
    return this._schema.destroy({ where: query })
  }
}

module.exports = PostgresStrategy;