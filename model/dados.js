const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SchemaData = new Schema({
    distanciaTotal: { type: Number, default: 0 },
    distanciaAtual: { type: Number, default: 0 },
    momentoInicio: { type: Date },
    momentoAtual: { type: Date },
    nomeCompetidor: { type: String, required: true, unique: true },
    devAdress: { type: String, required: true, unique: true }
})

module.exports = mongoose.model('Dados', SchemaData)