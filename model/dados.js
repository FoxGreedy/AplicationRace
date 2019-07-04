const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SchemaData = new Schema({
    distancia: { type: Number, default: 0, require: true },
    momento: { type: Date, required: true },
    nomeCompetidor: { type: String, required: true, unique: true }
})

module.exports = mongoose.model('Dados', SchemaData)