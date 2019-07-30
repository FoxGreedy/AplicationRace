const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const session = require('express-session')

//Banco de dados mongoDB
const config = require('./database/config').bd_string
const connection = require('./database/connection')
connection(config)

//Basic data source dos devices para o servidor teste
// const local = require('./model/gps')
// const socket = require('./socket/leitura').Teste
// const sending = require('./database/send').Teste
// sending(local, socket)

//Basic data source dos devices para o servidor final
const local = require('./model/gps')
const socket = require('./socket/leitura').Oficial
const sending = require('./database/send').Oficial
sending(local, socket)


//Configurando a estrutura da aplicação
var app = express()
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
    secret: 'lalala',
    resave: false,
    saveUninitialized: true,
    cookie: {
        name: 'testeNome',
        secure: 'auto',
        maxAge: Date.now() + (30 * 86400 * 1000)
    }
}))

app.use((req, res, next) => {
    next()
})


//Definindo as totas do servidor
const indexRouter = require('./routes/index')
const index2Router = require('./routes/index2')

const formsRouter = require('./routes/forms')
const historicRouter = require('./routes/historico')
const competidorRouter = require('./routes/competidor')
const dadosRouter = require('./routes/dados')
const localRouter = require('./routes/gps')
const dashRouter = require('./routes/dashboard')

// Usando as rotas do servidor
app.use('/', indexRouter)
app.use('/2', index2Router)
app.use('/formulario', formsRouter)
app.use('/historico', historicRouter)
app.use('/competidor', competidorRouter)
app.use('/dados', dadosRouter)
app.use('/local', localRouter)
app.use('/dashboard', dashRouter)

app.use(function (req, res, next) {
    next(createError(404))
})

app.use((err, req, res, next) => {
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    res.status(err.status || 500)
    res.render('error', {
        error: err.message
    })
})

module.exports = app

