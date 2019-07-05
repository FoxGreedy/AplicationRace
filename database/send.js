const gps = require('../model/gps')
const dadosCompetidor = require('../model/dados')
const competidor = require('../model/competidor')

function sendOficialDataSource(model, send) {

    send.on('message', (dados) => {
        let dadosJSON = JSON.parse(dados)
        timestamp = new Date()

        if (dadosJSON.type === "uplink") {

            let NewCoordinate = new model()

            // GPS

            let payload = dadosJSON.params.payload

            //Contruindo as informações em base 64
            let payload64 = new Buffer(payload, 'base64')

            //Decodificando as informações
            let payloadAscii = payload64.toString('ascii')

            let coordenadas = payloadAscii.split(',')
            let altidude = coordenadas[0]
            let latitude = coordenadas[1].replace(/[ ]+/g, '');
            let longitude = coordenadas[2].replace(/[ ]+/g, '');

            NewCoordinate.devAdress = dadosJSON.meta.device
            NewCoordinate.gps.alt = altidude
            NewCoordinate.gps.lat = latitude
            NewCoordinate.gps.lng = longitude

            NewCoordinate.save((err, Uplink) => {
                if (err) {
                    console.error('erro', err)
                } else {
                    pegarUltimasCoordenadas(Uplink.devAdress)
                    console.log("Coordenadas salvas com sucesso", Uplink)
                }
            })
        }
    })
}

function sendTesteDataSource(model, send) {

    send.on('message', (dados) => {
        let dadosJSON = JSON.parse(dados)
        timestamp = new Date()

        if (dadosJSON.type === "uplink") {

            let id = dadosJSON.meta.device
            let NewCoordinate = new model()

            NewCoordinate.devAdress = id
            NewCoordinate.gps.lat = dadosJSON.params.radio.hardware.gps.lat
            NewCoordinate.gps.lng = dadosJSON.params.radio.hardware.gps.lng
            NewCoordinate.gps.alt = dadosJSON.params.radio.hardware.gps.alt

            NewCoordinate.save((err, Uplink) => {
                if (err) {
                    console.error('erro', err)
                } else {
                    pegarUltimasCoordenadas(Uplink.devAdress)
                    console.log("Coordenadas salvas com sucesso", Uplink)
                }
            })
        }
    })
}

function pegarUltimasCoordenadas(id) {

    var dados = {
        gps: []
    }
    gps.find({
        devAdress: id
    }).exec((err, data) => {
        if (err) {
            console.error('Error', err)
        } else {
            if (data.length >= 2) {
                data = data.reverse()
                dados.gps = { ultimo: data[0], penultimo: data[1] }
                atualizarDistancia(id, pegarDistancia(data[0].gps, data[1].gps))
            } else{
                console.log('Não tem distancia suficiente')
            }
        }
    })
}

function pegarDistancia(ultima, penultima) {
    "use strict";
    var deg2rad = function (deg) { return deg * (Math.PI / 180); },
        R = 6371,
        dLat = deg2rad(penultima.lat - ultima.lat),
        dLng = deg2rad(penultima.lng - ultima.lng),
        a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
            + Math.cos(deg2rad(ultima.lat))
            * Math.cos(deg2rad(ultima.lat))
            * Math.sin(dLng / 2) * Math.sin(dLng / 2),
        c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return ((R * c * 1000).toFixed());
}

function atualizarDistancia(id, distancia) {

    dadosCompetidor.find({ devAdress: id })
        .exec((err, data) => {
            if (err) {
                console.error('Error', err)
            } else {
                distanciaTotal = distancia + data[0].distancia
                dadosCompetidor.findOneAndUpdate({ nomeCompetidor: data.nomeCompetidor },
                    { $set: { distancia: distanciaTotal } },
                    { upsert: true },
                    (err, data) => {
                        if (err) {
                            console.log('Error', err)
                        } else {
                            console.log('Dados atualizados com sucesso', data)
                        }
                    })
            }
        })

}



module.exports.Oficial = sendOficialDataSource
module.exports.Teste = sendTesteDataSource
