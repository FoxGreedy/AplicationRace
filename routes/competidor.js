const express = require('express')
const router = express.Router()

const competidor = require('../model/competidor')
const dados = require('../model/dados')

router.get('/', (req, res) => {
    competidor.find({})
        .exec((err, data) => {
            if (err) {
                res.send(err)
            } else {
                res.send(data)
            }
        })
})

router.get('/:nome', (req, res) => {
    competidor.find({
        nome: req.params.nome
    })
        .exec((err, data) => {
            if (err) {
                res.send(err)
            } else {
                res.send(data)
            }
        })
})


// POST

router.post('/', (req, res) => {

    timestamp = new Date()

    function calcularData(data, offset) {
        var milisegundos_com_utc = data.getTime() + (data.getTimezoneOffset() * 60000);
        return new Date(milisegundos_com_utc + (3600000 * offset));
    }

    user = req.body

    competidor.create(user, (err, data) => {
        if (err) {
            console.error('Erro', err)
        } else {
            var newDate = new dados()
            newDate.nomeCompetidor = user.nome
            newDate.devAdress = user.devAdress
            newDate.momentoInicio = calcularData(timestamp, -6)
            newDate.momentoAtual = calcularData(timestamp, -6)

            newDate.save((err, data) => {
                if (err) {
                    console.error('Error', err)
                } else {
                    console.log('Tudo certo', data)
                    res.send(data)
                }
            })

        }
    })

})

module.exports = router