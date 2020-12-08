const assert = require('assert')
const api = require('../../api')
const Context = require('./../db/strategies/base/contextStrategy')
const Postgres = require('./../db/strategies/postgresdb/postgresStrategy')
const UserSchema = require('./../db/strategies/postgresdb/schemas/usuarioSchema')

let app = {}

const USER = {
    username: 'ovylqknvxjfloj',
    password: '17c4428e3410ad4b3ed2bf78e2dd72e6c056bf2c3c1e448f1bac1bcc8445b459'
}

const USER_DB = {
    username: USER.username.toLocaleLowerCase(),
    password: '$2a$04$xx9PJikHavBkX/p5IQlzw.KhAhMDj5igLIQa8EFiVY7pJjd.1hueG'
}

describe('Authorization JWT', function () {
    this.timeout(Infinity)
    this.beforeAll(async () => {
        app = await api
        const connectionPostgres = await Postgres.connect()
        const model = await Postgres.defineModule(connectionPostgres, UserSchema)
        const Pcontext = new Context(new Postgres(connectionPostgres, model))
        await Pcontext.update(null, USER_DB, true)
    })

    it('Obter Token JWT', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: USER
        })
        const statusCode = result.statusCode
        assert.deepStrictEqual(statusCode, 200)
    })
    it('Deve retornar não autorizado ao tentar obter um login errado', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: 'ErickWendel',
                password: '533'
            }
        })
        assert.deepStrictEqual(result.statusCode, 401)
    })
})