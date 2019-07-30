const express = require('express')
const router = express.Router()

const competidor = require('../model/competidor')
const dados = require('../model/dados')
const gps = require('../model/gps')

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

router.get('/zerar', (req, res) => {
    dados.updateMany(
        {},
        { $set: { distanciaTotal: 0, distanciaAtual: 0, } }, 
        { upsert: true },
        (err, data) =>{
            res.send(data)
        }
    )
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