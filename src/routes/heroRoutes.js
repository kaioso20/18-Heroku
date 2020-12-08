const BaseRoutes = require('./base/baseRoutes')

const Joi = require('joi')
const Boom = require('boom')

const headers = Joi.object({
    authorization: Joi.string().required()
}).unknown()

class heroHoutes extends BaseRoutes {
    constructor(db) {
        super()
        this._db = db
    }

    list() {
        return {
            method: 'GET',
            path: '/herois',
            handler: async (require, head) => {
                try {
                    const { nome, skip, limit } = require.query

                    const _nome = nome ? { nome: { $regex: `.*${nome}*.` } } : {}
                    return await this._db.read(_nome, skip, limit)
                } catch (error) {
                    return Boom.internal(error)
                }
            },
            config: {
                auth: 'jwt',
                validate: {
                    failAction: (request, headers, erro) => {
                        return Boom.teapot(erro)
                    },
                    query: Joi.object({
                        skip: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(10),
                        nome: Joi.string().min(1).max(100)
                    }).options({ stripUnknown: true }),
                    headers
                }
            },
        }
    }

    create() {
        return {
            method: 'POST',
            path: '/herois',
            handler: async (require, head) => {
                try {
                    const { nome, poder } = require.payload

                    return await this._db.create({ nome, poder })
                } catch (error) {
                    return Boom.internal(error)
                }
            },
            config: {
                auth: 'jwt',
                validate: {
                    failAction: (request, headers, erro) => {
                        return Boom.teapot(erro)
                    },
                    payload: Joi.object({
                        nome: Joi.string().min(1).max(100).required(),
                        poder: Joi.string().min(1).max(100).required()
                    }).options({ stripUnknown: true }),
                    headers
                }
            },
        }
    }

    update() {
        return {
            path: '/herois/{id}',
            method: 'PATCH',
            handler: async (request) => {
                try {
                    const { id } = request.params
                    const { payload } = request
                    const dadosString = JSON.stringify(payload)
                    const dados = JSON.parse(dadosString)
                    return await this._db.update(id, dados)
                } catch (error) {
                    return Boom.internal(erro)
                }
            },
            config: {
                auth: 'jwt',
                validate: {
                    params: Joi.object({
                        id: Joi.string().required(),
                        nome: Joi.string().min(1).max(100),
                        poder: Joi.string().min(1).max(100)
                    }).options({ stripUnknown: true }),
                    headers,
                    failAction: (request, headers, erro) => {
                        return Boom.teapot(erro)
                    }
                }
            }
        }
    }

    delete() {
        return {
            path: `/herois/{id}`,
            method: 'DELETE',
            handler: async (request) => {
                try {
                    const { id } = request.params
                    return await this._db.delete(id)
                } catch (error) {
                    return Boom.internal(error)
                }
            },
            config: {
                auth: 'jwt',
                validate: {
                    params: Joi.object({
                        id: Joi.string().required()
                    }).options({ stripUnknown: true }),
                    headers,
                    failAction: (req, res, erro) => {
                        return Boom.teapot(erro)
                    }
                }
            }
        }
    }
}

module.exports = heroHoutes