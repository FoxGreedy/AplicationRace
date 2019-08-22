const express = require('express')
const router = express.Router()

const competidor = require('../model/competidor')
const dados = require('../model/dados')
const gps = require('../model/gps')

function calcularData(data, offset) {
    var milisegundos_com_utc = data.getTime() + (data.getTimezoneOffset() * 60000);
    return new Date(milisegundos_com_utc + (3600000 * offset));
}

router.get('/', (req, res) => {
    dados.find({})
        .exec((err, data) => {
            if (err) {
                res.send(err)
            } else {
                res.send(data)
            }
        })
})

router.get('/info', (req, res) => {

    dado = {
        participantes: [],
        infos: [],
        gps: []
    }

    competidor.find({})
        .exec((err, data) => {
            if (err) {
                res.send('Erro', err)
            } else {
                dado.participantes = data
                dados.find({})
                    .exec((err, data) => {
                        if (err) {
                            console.error('Erro', err)
                        } else {
                            dado.infos = data
                            gps.find()
                                .exec((err, data) => {
                                    if (err) {
                                        console.error('Erro', err)
                                    } else {
                                        dado.gps = data
                                        res.send(dado)
                                    }
                                })
                        }
                    })
            }
        })
})

router.post('/competidor/cadastrar',
    async function sign(req, res) {

        let { devAdress, nome, sobrenome, foto, peso } = req.body

        let deviceExists = await competidor.findOne({ devAdress })
        let competidorExists = await competidor.findOne({ nome, sobrenome })

        if (deviceExists) {
            console.log('Device já existe')
            return res.status(404).send({ message: "Device já cadastrado em alguem!" })
        }
        if (competidorExists) {
            console.log('Competidor já existe')
            return res.status(404).send({ message: "Competidor já foi cadastrado" })
        }

        competidores = await competidor.find()

        await competidor.create({
            nome,
            devAdress,
            sobrenome,
            peso,
            foto,
            corPin: competidores.length + 1,
        })

        await dados.create({
            nomeCompetidor: nome,
            devAdress
        })

        res.status(201)

    })

router.get('/iniciar/todos', (req, res) => {
    dados.updateMany({}, {
        status: 99
    },
        { upsert: true },
        (err, sucesso) => {
            if (err) {
                console.error(err)
            } else {
                res.redirect('/')
            }
        })
})

router.get('/finalizar/todos', (req, res) => {
    dados.updateMany({}, {
        status: 100
    },
        { upsert: true },
        (err, sucesso) => {
            if (err) {
                console.error(err)
            } else {
                res.redirect('/')
            }
        })
})

router.put('/iniciar/:devAdress', (req, res) => {
    let { params: { devAdress } } = req

    console.log(devAdress)

    dados.findOneAndUpdate({ devAdress: devAdress },
        {
            distanciaAtual: 0,
            distanciaTotal: 0,
            status: 99,
            momentoAtual: calcularData(new Date(), -3),
            momentoInicio: calcularData(new Date(), -3)
        },
        { upsert: true },
        (err, data1) => {
            if (err) {
                console.log('Error', err)
            } else {
                gps.deleteMany({ devAdress }, (err, data2) => {
                    if (err) console.log(err)
                    else return res.send({ data: { data1, data2 } })
                })
            }
        })

})

router.put('/finalizar/:devAdress', (req, res) => {
    let { params: { devAdress } } = req;

    console.log(devAdress)

    dados.findOneAndUpdate({ devAdress: devAdress },
        {
            $set: {
                distanciaTotal: 10000,
                status: 100,
                momentoAtual: calcularData(new Date(), -3)
            }
        },
        { upsert: true }, (err, data1) => {
            if (err) console.log(err)
            else return res.send(data1)
        })
})

router.put('/desclassificar/:devAdress', (req, res) => {
    let { params: { devAdress } } = req

    dados.findOneAndUpdate({ devAdress },
        { $set: { status: 0 } },
        { upsert: true }, (err, data1) => {
            if (err) return res.send(err)
            else return res.send(data1)
        })
})

router.get('/teste/:devAdress', async (req, res) => {
    let { params: { devAdress } } = req

    let dadoDuplicado = await gps.findOne({
        devAdress: devAdress,
        gps: {
            alt: "1",
            lat: "-23.59549",
            lng: "-46.68280"
        }
    })

    if (!dadoDuplicado) {
        return res.send({ 'Message': 'Batata' })
    }
    res.send(dadoDuplicado)
})

router.get('/:nomeCompetidor', (req, res) => {
    dados.find({
        nomeCompetidor: req.params.nomeCompetidor
    })
        .exec((err, data) => {
            if (err) {
                res.send(err)
            } else {
                res.send(data)
            }
        })
})

router.put('/:nomeCompetidor', (req, res) => {
    var distanciaTotal = 0
    let { body: { distancia } } = req
    let { params: { nomeCompetidor } } = req

    dados.find({ nomeCompetidor: nomeCompetidor })
        .exec((err, data) => {
            if (err) {
                console.error('Error', err)
            } else {
                distanciaTotal = distancia + data[0].distancia
                dados.findOneAndUpdate({ nomeCompetidor: nomeCompetidor },
                    { $set: { distancia: distanciaTotal, distanciaAtual: distancia } },
                    { upsert: true },
                    (err, data) => {
                        if (err) {
                            console.log('Error', err)
                        } else {
                            res.send(data)
                        }
                    })
            }
        })
})






module.exports = router