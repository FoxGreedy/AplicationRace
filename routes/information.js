const router = require('express').Router()

router.get('/', (req, res) => {
    res.render('information')
})

module.exports = router