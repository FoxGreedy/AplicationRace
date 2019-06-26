const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SchemaCompetidor = new Schema({
    idCompetidor: { type: Number, unique: true, required: true },
    nome: {type: String, required: true},
    devAdress: {type:String, required: true}
})

module.exports = mongoose.model('Competidor', SchemaCompetidor)
