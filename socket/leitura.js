const WebSocket = require('ws')

let urlUplinkOficial = `wss://ns.atc.everynet.io/api/v1.0/data?access_token=2d9b184febf54e4cb5c3c7029b827033&types=uplink,location&radio=1&duplicate=0&lora=1&devices=0004a30b00230352,0004a30b00236b41,ffffbeddc2156a46,ffff3e71bf3683fc`
wsOficial = new WebSocket(urlUplinkOficial)

let urlUplinkTeste = `wss://ns.atc.everynet.io/api/v1.0/data?access_token=2d9b184febf54e4cb5c3c7029b827033&types=uplink,location&radio=1&duplicate=0&lora=1&devices=0004a30b0020a3c1,70b3d54b10003b8f`
wsTeste = new WebSocket(urlUplinkTeste)

module.exports.Oficial = wsOficial 
module.exports.Teste = wsTeste