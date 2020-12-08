const BaseRoutes = require('./base/baseRoutes')

const Joi = require('joi')
const Boom = require('boom')
const HapiJwt = require('hapi-auth-jwt2')

const PasswordHelper = require('./../helper/passwordHelper')

//npm i jsonwebtoken
const Jwt = require('jsonwebtoken')

const USER = {
    username: 'Ymir',
    password: '123456'
}
class AuthRoutes extends BaseRoutes {

    constructor(secret, db) {
        super()
        this._secret = secret
        this._db = db
    }

    login() {
        return {
            path: '/login',
            method: 'POST',
            config: {
                auth: false,
                validate: {
                    failAction: (request, headers, erro) => {
                        return Boom.teapot(erro)
                    },
                    payload: Joi.object({
                        username: Joi.string().required(),
                        password: Joi.string().required()
                    })
                }
            },
            handler: async (request) => {
                const { username, password } = request.payload

                const [usuario] = await this._db.read({username: username.toLowerCase()})

                if (!usuario) 
                    return Boom.unauthorized('O usuário informado não existe')
                
                const match = await PasswordHelper.comparePassword(password, usuario.password)

                if (!match) {
                    return Boom.unauthorized('Usuário ou senha inválidos!')
                }

                const token = Jwt.sign({
                    username,
                    id: usuario.id
                }, this._secret)

                console.log(token)

                return { token }
            }
        }
    }
}
module.exports = AuthRoutes