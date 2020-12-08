const assert = require('assert');

const Postgres = require('../db/strategies/postgresdb/postgresStrategy');
const Context = require('../db/strategies/base/contextStrategy');
const heroiSchema = require('../db/strategies/postgresdb/schemas/heroiSchema')


let context = {}
const MOCK_HEROI_CADASTRAR = { nome: 'Gaviao Negro', poder: 'flexas' }
const MOCK_HEROI_ATUALIZAR = { nome: 'Super Homem', poder: 'Super Força' }

describe('Postgres Strategy', function () {
    this.timeout(Infinity)
    this.beforeAll(async () => {
        const connection = await Postgres.connect()
        const model = await Postgres.defineModule(connection, heroiSchema)
        context = new Context(new Postgres(connection, model))
        await context.delete()
        await context.create(MOCK_HEROI_CADASTRAR)
    })
    it('PostgreSQL Connection', async () => {
        const expected = true;
        const result = await context.isConnected();

        assert.deepStrictEqual(result, expected)
    })
    it('Postgres Create', async () => {
        const result = await context.create(MOCK_HEROI_CADASTRAR);
        delete result.id
        assert.deepStrictEqual(result, MOCK_HEROI_CADASTRAR)
    })
    it('Postgres Read', async () => {
        const [result] = await context.read({ nome: MOCK_HEROI_CADASTRAR.nome })
        delete result.id
        assert.deepStrictEqual(result, MOCK_HEROI_CADASTRAR)
    })
    it('Postgres Update', async () => {
        const [readOnlyOne] = await context.read({ nome: MOCK_HEROI_CADASTRAR.nome })
        const [result] = await context.update(readOnlyOne.id, MOCK_HEROI_ATUALIZAR, false)
        assert.deepStrictEqual(result, 1)

        const [getUserAtualizado] = await context.read({ id: readOnlyOne.id })
        delete getUserAtualizado.id
        assert.deepStrictEqual(getUserAtualizado, MOCK_HEROI_ATUALIZAR)
    })
    it('Postgres Delete', async () => {
        const [item] = await context.read({})
        const result = await context.delete(item.id)
        assert.deepStrictEqual(result, 1)
    })
});