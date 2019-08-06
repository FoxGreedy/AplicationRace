const router = require('express').Router()
const competidor = require('../model/competidor')

router.get('/', (req, res) => {
    competidor.find({})
        .exec((err, data) => {
            if (err) {
                res.send('Erro', err)
            } else {
                res.render('index', { competidores: data })
            }
        })
})

module.exports = router