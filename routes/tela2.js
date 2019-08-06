const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {

    res.render('tela2')

})

module.exports = router