const mongoS = require('./src/db/strategies/mongoDbStrategy')
const postgS = require('./src/db/strategies/postgresStrategy')
const Context = require('./src/db/strategies/base/contextStrategy');

const contextM = new Context(new mongoS())

const contextP = new Context(new postgS())