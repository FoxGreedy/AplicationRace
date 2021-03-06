const router = require('express').Router()

const competidor = require('../model/competidor')

router.get('/', (req, res) => {
    competidor.find({})
        .exec((err, data) => {
            if (err) {
                res.send(err)
            } else {
                res.render('dashboard', { competidores: data })
            }
        })
})

module.exports = router