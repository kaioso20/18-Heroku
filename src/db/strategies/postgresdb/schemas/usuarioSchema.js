const Sequelize = require('sequelize')

const usuariochema = {
    name: 'usuarios',
    schema: {
        id: {
            type: Sequelize.INTEGER,
            reqrequired: true,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: Sequelize.STRING,
            unique: true,
            required: true
        },
        password: {
            type: Sequelize.STRING,
            required: true
        }
    },
    options: {
        tableName: 'TB_USUARIOS',
        freezeTableName: false,
        timestamps: false
    }
}
module.exports = usuariochema