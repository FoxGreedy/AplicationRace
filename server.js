const app = require('./app')
const debug = require('debug')('backend-node:server')

const http = require('http')
var port = normalizePort(process.env.PORT || '3333')

app.set('port', port)

var server = http.createServer(app)

server.listen(port, () => {
    console.log(`Iniciando na porta ${port}`)
})

server.on('error', onError)
server.on('listening', onListening)

function normalizePort(val) {
    const port = parseInt(val, 10)

    if (isNaN(port)) {
        return val
    }
    if (port >= 0) {
        return port
    }

    return false
}

function onError(error) {

    if (error.syscall !== 'listen') {
        throw error
    }

    var bind = typeof port !== 'listen'
        ? 'Pipe ' + port
        : 'Port ' + port

    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated priviges')
            process.exit(1)
            break
        case 'EDDRINUSE':
            console.error(bind + 'is already in use')
            process.exit(1)
            break
        default:
            throw error
    }
    
}

function onListening() {

    var addr = server.address()
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port
    debug('Listening on ' + bind)

}