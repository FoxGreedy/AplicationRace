const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('informacoes')
})

module.exports = router