const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SchemaData = new Schema({
    distanciaTotal: { type: Number, default: 0 },
    distanciaAtual: { type: Number, default: 0 },
    momentoInicio: { type: Date, default: new Date() },
    momentoAtual: { type: Date, default: new Date() },
    nomeCompetidor: { type: String, required: true },
    devAdress: { type: String, required: true, unique: true },
    status: {type: String, default: "No Initialized"}    
})

module.exports = mongoose.model('Dados', SchemaData)