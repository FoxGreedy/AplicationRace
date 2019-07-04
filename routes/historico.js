const express = require('express')
const router = express.Router()

const gps = require('../model/gps')
const dadosCompetidor = require('../model/dados')
const competidor = require('../model/competidor')

// GET

router.get('/', (req, res) => {
    let dados = {
        gps: [],
        competidor: [],
        data: []
    }
    gps.find({})
        .exec((err, data) => {
            if (err) {
                res.send(err)
            } else {
                dados.gps = data
                dadosCompetidor.find({})
                    .exec((err, data) => {
                        if (err) {
                            res.send(err)
                        } else {
                            dados.data = data
                            competidor.find({})
                                .exec((err, data) => {
                                    if (err) {
                                        res.send(err)
                                    } else {
                                        dados.competidor = data
                                        res.send(dados)
                                    }
                                })
                        }
                    })
            }
        })
})


router.get('/:devAdress', (req, res) => {

    let dados = {
        gps: []
    }

    gps.find({
        devAdress: req.params.devAdress
    }).exec((err, data) => {
        if (err) {
            console.error('Error', err)
        } else {
            data = data.reverse()
            dados.gps = { ultimo: data[0], penultimo: data[1] }
            res.json(dados)
        }
    })

})

router.get('/distancia/:devAdress', (req, res) => {

    let dados = {
        gps: [],
        competidor: [],
        dadosCompetidor: []
    }

    gps.find({
        devAdress: req.params.devAdress
    }).exec((err, data) => {
        if (err) {
            console.error('Error', err)
        } else {
            data = data.reverse()
            dados.gps = { ultimo: data[0], penultimo: data[1] }
            competidor.find({
                devAdress: data[0].devAdress
            }).exec((err, data1) => {
                if (err) {
                    console.error('Error', err)
                } else {
                    dados.competidor = data1
                    dadosCompetidor.find({
                        nomeCompetidor: data1[0].nome
                    }).exec((err, data2) => {
                        if (err) {
                            console.log('Error', err)
                        } else {
                            dados.dadosCompetidor = data2
                            res.json(dados)
                        }
                    })
                }
            })
        }
    })
})




module.exports = router