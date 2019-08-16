const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SchemaCompetidor = new Schema({
    devAdress: { type: String, required: true, unique: true },
    nome: { type: String, required: true },
    sobrenome: { type: String, require: true },
    peso: { type: Number, required: true },
    corPin: { type: Number, required: true },
    foto: { type: String, required: true },
})

module.exports = mongoose.model('Competidor', SchemaCompetidor)
