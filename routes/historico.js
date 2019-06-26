const express = require('express')
const router = express.Router()

const gps = require('../model/gps')

router.get('/', (req, res) =>{
    gps.find({})
    .exec((err, data) =>{
        if(err){
            res.send(err)
        } else{
            res.send(data)
        }
    } )
})

module.exports = router