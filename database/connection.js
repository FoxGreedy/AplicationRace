const mongoose = require('mongoose')

const options = { reconnectTries: Number.MAX_VALUE, reconnectInterval: 500, poolSize: 5, useNewUrlParser: true }

function connectDB(url) {

    mongoose.connect(url, options)
    mongoose.set('useCreateIndex', true)
    mongoose.connection.on('error', (err) => {
        console.log('Erro na conexão com o banco de dados', err)
    })
    mongoose.connection.on('disconnected', () => {
        console.log('Aplicação desconectada do banco de dados')
    })
    mongoose.connection.on('connected', () => {
        console.log('Conexão realizada com sucesso!')
    })

}

module.exports = connectDB