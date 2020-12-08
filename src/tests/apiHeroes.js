const assert = require('assert')
const api = require('../../api')

let app = {}

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InltaXIiLCJpZCI6MSwiaWF0IjoxNjA3MzY5OTcyfQ.c8sNVWSMFQQ4MCthjL-DuZg_1nPpKV7Bh8pr1mh8j48'

const headers = {
    Authorization: TOKEN
}

const Payload = {
    nome: 'Batman',
    poder: 'Dinheiro'
}

const Payload_Edit_Parcial = {
    nome: 'Coringa'
}

const Payload_Edit = {
    nome: 'Coringa',
    poder: 'Risada'
}
let mockID = ''

describe('Teste de Requisições Hapi.js', function () {
    this.timeout(Infinity)
    this.beforeAll(async () => {
        app = await api
    })

    //#region 'Create'

    it('HAPI.JS => Create (situação de erro)', async () => {
        const result = await app.inject({
            method: 'POST',
            headers,
            url: '/herois',
            payload: Payload_Edit_Parcial
        })

        assert.deepStrictEqual(result.statusCode, 418)
    })

    it('HAPI.JS => Create (situação de acerto)', async () => {
        const result = await app.inject({
            method: 'POST',
            headers,
            url: '/herois',
            payload: Payload
        })
        const { _id } = JSON.parse(result.payload)
        mockID = _id
        assert.deepStrictEqual(result.statusCode, 200)
    })
    //#endregion

    //#region 'Update'
    it('HAPI.JS => Update PATCH (situação de acerto)', async () => {
        const _id = mockID
        const { result } = await app.inject({
            method: 'PATCH',
            headers,
            url: `/herois/${_id}`,
            payload: Payload_Edit_Parcial
        })
        assert.deepStrictEqual(result.nModified, 1)
    })
    it('HAPI.JS => Update PATCH (situação de erro)', async () => {
        const _id = `${mockID}0102002` /* Fake ID */
        const { result } = await app.inject({
            method: 'PATCH',
            headers,
            url: `/herois/${_id}`,
            payload: Payload_Edit_Parcial
        })
        assert.deepStrictEqual(result.statusCode, 500)
    })
    //#endregion

    //#region 'Read'
    it('HAPI.JS => Read', async () => {
        const result = await app.inject({
            headers,
            method: 'GET',
            url: '/herois'
        })
        assert.deepStrictEqual(result.statusCode, 200)
    })

    it('HAPI.JS => Read (c/ Limite de resultados)', async () => {
        const result = await app.inject({
            method: 'GET',
            headers,
            url: '/herois?limit=10'
        })
        assert.deepStrictEqual(result.statusCode, 200)
    })

    it('HAPI.JS => Read (c/ Filtro de Nome)', async () => {
        const result = await app.inject({
            method: 'GET',
            headers,
            url: '/herois?nome=PernaLonga'
        })
        assert.deepStrictEqual(result.statusCode, 200)
    })
    //#endregion

    //#region 'Delete'
    it('HAPI.JS - Delete (situação de acerto)', async () => {

        const _id = mockID
        const { result } = await app.inject({
            url: `/herois/${_id}`,
            headers,
            method: 'DELETE',
        })
        assert.deepStrictEqual(result.n, 1)
    })
    it('HAPI.JS - Delete (situação de erro 1 - ID falso)', async () => {

        const _id = mockID
        const { result } = await app.inject({
            url: `/herois/${_id}0112123`,
            headers,
            method: 'DELETE',
        })
        assert.deepStrictEqual(result.statusCode, 500)
    })
    it('HAPI.JS - Delete (situação de erro 2 - Sem ID)', async () => {
        const { result } = await app.inject({
            url: `/herois/${null}`,
            headers,
            method: 'DELETE',
        })
        assert.deepStrictEqual(result.statusCode, 500)
    })
    //#endregion
})