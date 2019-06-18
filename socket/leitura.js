const WebSocket = require('ws')

let urlUplink = `wss://ns.atc.everynet.io/api/v1.0/data?access_token=2d9b184febf54e4cb5c3c7029b827033&types=uplink,location&radio=1&duplicate=0&lora=1&devices=11535c2532a84f22, 70b3d54b10003a2c`
ws = new WebSocket(urlUplink)

module.exports = ws
