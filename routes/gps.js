const express = require('express')
const router = express.Router()

const gps = require('../model/gps')
const competidor = require('../model/competidor')

router.get('/', (req, res) => {
    gps.find({})
        .exec((err, data) => {
            if (err) {
                res.send(err)
            } else {
                res.send(data)
            }
        })
})

router.get('/:devAdress', (req, res) => {
    gps.find({
        devAdress: req.params.devAdress
    })
        .exec((err, data) => {
            if (err) {
                res.send(err)
            } else {
                res.send(data)
            }
        })
})

router.get('/dispositivo', (req, res) =>{
    gps.findOne({})
        .exec((err, data) => {
            if(err){
                res.send(err)
            } else{
                res.send(data)
            }
        })
})



module.exports = router