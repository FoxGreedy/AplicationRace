const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {

    res.render('tela1')

})

module.exports = router