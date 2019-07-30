const express = require('express')
const router = express.Router()

const competidor = require('../model/competidor')

router.get('/', (req, res) => {
    competidor.find({})
        .exec((err, data) => {
            if (err) {
                res.send(err)
            } else {
                res.render('index2', { competidores: data })
            }
        })
})

module.exports = router