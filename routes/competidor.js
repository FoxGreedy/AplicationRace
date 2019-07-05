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

    user = req.body

    competidor.create(user, (err, data) => {
        if (err) {
            res.send(err)
        } else {

            var newDate = new dados()
            newDate.momento = new Date().getTime()
            newDate.distancia = 0
            newDate.nomeCompetidor = user.nome
            newDate.devAdress = user.devAdress

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