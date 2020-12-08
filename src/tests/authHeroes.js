const assert = require('assert')
const api = require('../../api')
const Context = require('./../db/strategies/base/contextStrategy')
const Postgres = require('./../db/strategies/postgresdb/postgresStrategy')
const UserSchema = require('./../db/strategies/postgresdb/schemas/usuarioSchema')

let app = {}

const USER = {
    username: 'ymir',
    password: '123456'
}

const USER_DB = {
    username: USER.username.toLocaleLowerCase(),
    password: '$2b$04$vrcwZAv4/2ldWaPGo8VOPe.ZZQOM3W7ywZhbcr6Q1kpCWdaBCG0xW'
}

describe('Authorization JWT', function () {
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