const assert = require('assert');

const Mongodb = require('./../db/strategies/mongodb/mongodbStrategy');
const Context = require('./../db/strategies/base/contextStrategy');
const heroiSchema = require('./../db/strategies/mongodb/schemas/heroisSchema')

let context = {}

const SUPER_MOCK = {
    nome: 'Super Havan',
    poder: 'Dinheiro'
}
const SUPER_MOCK_Atualizar = {
    nome: 'Patolino',
    poder: 'Dinheiro'
}

describe('Mongo_DB Strategy', function () {
    this.timeout(Infinity)
    this.beforeAll(async () => {
        const connection = Mongodb.connect()
        context = new Context(new Mongodb(connection, heroiSchema))
        await context.create(SUPER_MOCK)
        await context.create(SUPER_MOCK_Atualizar)
    })
    it('MongoDB Connection', async () => {
        const result = await context.isConnected();
        const expected = 'connected';

        assert.deepStrictEqual(result, expected);
    })
    it('MongoDB Create', async () => {
        const { nome, poder } = await context.create(SUPER_MOCK);

        assert.deepStrictEqual({ nome, poder }, SUPER_MOCK);
    })
    it('MongoDB Read', async () => {
        const [{ nome, poder }] = await context.read({ nome: SUPER_MOCK.nome });
        assert.deepStrictEqual({ nome, poder }, SUPER_MOCK);
    })
    it('MongoDB Update', async () => {
        const [{_id}] = await context.read({ nome: SUPER_MOCK.nome });
        const validador = await context.update(_id, { nome: SUPER_MOCK_Atualizar.nome });
        assert.deepStrictEqual(validador.nModified, 1);
    })
    it('MongoDB Delete All', async () => {
        const deleted = await context.delete();
        assert.deepStrictEqual(deleted.ok, 1);
    })

})