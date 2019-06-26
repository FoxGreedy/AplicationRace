const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SchemaData = new Schema({
    idCompetidor: { type: Number, required: true, unique: true },
    distancia: { type: Number, default: 0 },
})

module.exports = mongoose.model('Dados', SchemaData)