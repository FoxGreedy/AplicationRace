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
                    pegarUltimasCoordenadas(Uplink.devAdress, -3)
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
                    pegarUltimasCoordenadas(Uplink.devAdress, -6)
                    console.log("Coordenadas salvas com sucesso", Uplink)
                }
            })
        }
    })
}

function pegarUltimasCoordenadas(id, fuso) {
    gps.find({
        devAdress: id
    }).exec((err, data) => {
        if (err) {
            console.error('Error', err)
        } else {
            if (data.length >= 2) {
                data = data.reverse()
                console.log(fuso)
                atualizarDistancia(id, pegarDistancia(data[0].gps, data[1].gps), fuso)
            } else {
                iniciarCalculoDistancia(id, fuso)
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

function calcularData(data, offset) {
    var milisegundos_com_utc = data.getTime() + (data.getTimezoneOffset() * 60000);
    return new Date(milisegundos_com_utc + (3600000 * offset));
}

function atualizarDistancia(id, distancia, fuso) {

    dadosCompetidor.find({ devAdress: id })
        .exec((err, data) => {
            if (err) {
                console.error('Error', err)
            } else {
                distanciaTotal = distancia + data[0].distanciaTotal
                dadosCompetidor.findOneAndUpdate({ devAdress: id },
                    {
                        $set: {
                            distanciaTotal: distanciaTotal,
                            distanciaAtual: distancia,
                            momentoAtual: calcularData(new Date(), fuso)
                        }
                    },
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

function iniciarCalculoDistancia(id, fuso) {

    dadosCompetidor.findOneAndUpdate({ devAdress: id },
        { $set: { momentoInicio: calcularData(new Date(), fuso) } },
        { upsert: true },
        (err, data1) => {
            if (err) {
                console.log('Error', err)
            } else {
                console.log('Os dados foram atualizados para a atualização', data1)
            }
        })

}


module.exports.Oficial = sendOficialDataSource
module.exports.Teste = sendTesteDataSource
