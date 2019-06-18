const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SchemaLocal = new Schema({

    devAdress: { type: String, required: true},
    gps: {
        lat: { type: Number },
        lng: { type: Number },
        alt: { type: Number }
    }

})

module.exports = mongoose.model('gps', SchemaLocal)