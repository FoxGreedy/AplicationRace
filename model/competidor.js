const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SchemaCompetidor = new Schema({
    nome: {type: String, required: true, unique: true},
    devAdress: {type:String, required: true, unique: true},
    equipe: {type: String, required: true},
    foto: {type: String, required: true}
})

module.exports = mongoose.model('Competidor', SchemaCompetidor)
