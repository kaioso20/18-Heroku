const { config } = require('dotenv')
const { join } = require('path')

const {ok} = require('assert')
const env = process.env.NODE_ENV || 'dev'
ok(env === 'dev' || env === 'prod', 'O ENV é inválido!!')

const configPath = join(__dirname , './config', `.env.${env}`)
config({
    path: configPath
})

const Context = require('./src/db/strategies/base/contextStrategy')
const MongoDB = require('./src/db/strategies/mongodb/mongodbStrategy')
const PostgresStrategy = require('./src/db/strategies/postgresdb/postgresStrategy')
const HeroiSchema = require('./src/db/strategies/mongodb/schemas/heroisSchema')
const HeroRoutes = require('./src/routes/heroRoutes')
const AuthRoutes = require('./src/routes/authRoutes')

const Hapi = require('@hapi/hapi');
const Jwt = require('hapi-auth-jwt2');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const Joi = require('joi')
const UsuarioSchema = require('./src/db/strategies/postgresdb/schemas/usuarioSchema')

const jwt_secret = process.env.JWT_KEY

function EachRoute(instance, methods) {
    return methods.map(method => instance[method]())
}

async function main() {
    const connection = MongoDB.connect()
    const context = new Context(new MongoDB(connection, HeroiSchema))
    const connectionPostgres = await PostgresStrategy.connect()
    const model = await PostgresStrategy.defineModule(connectionPostgres, UsuarioSchema)
    const PContext = new Context(new PostgresStrategy(connectionPostgres, model))

    const server = Hapi.server({ port: process.env.PORT });

    // Register jwt with the server

    await server.register(Jwt);

    // Declare an authentication strategy using the jwt scheme.
    // Use keys: with a shared secret key OR json web key set uri.
    // Use verify: To determine how key contents are verified beyond signature.
    // If verify is set to false, the keys option is not required and ignored.
    // The verify: { aud, iss, sub } options are required if verify is not set to false.
    // The verify: { exp, nbf, timeSkewSec, maxAgeSec } paramaters have defaults.
    // Use validate: To create a function called after token validation.

    server.auth.strategy('jwt', 'jwt', {
        key: jwt_secret,
        options: {
            expiresIn: 0
        },
        validate: async (dados, request) => {
            const [result] = await PContext.read({
                username: dados.username.toLowerCase()
            })
            return {
                isValid: !result ? false : true
            };
        }
    });

    // Set the strategy

    server.auth.default('jwt');

    server.route([
        ...EachRoute(new HeroRoutes(context), HeroRoutes.methods()),
        ...EachRoute(new AuthRoutes(jwt_secret, PContext), AuthRoutes.methods())
    ])

    await server.start()
    return server
}

module.exports = main()