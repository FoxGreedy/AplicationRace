const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SchemaLocal = new Schema({

    devAdress: { type: String, required: true},
    momento: { type: Date},
    gps: {
        lat: { type: String },
        lng: { type: String },
        alt: { type: String }
    }

})

module.exports = mongoose.model('gps', SchemaLocal)
