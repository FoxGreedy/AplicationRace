
"use strict";
var deg2rad = function (deg) { return deg * (Math.PI / 180); },
    R = 6371,
    dLat = deg2rad(-23.601419 - -23.601330),
    dLng = deg2rad(-46.667129 - -46.667865),
    a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
        + Math.cos(deg2rad(-23.60133))
        * Math.cos(deg2rad(-23.60133))
        * Math.sin(dLng / 2) * Math.sin(dLng / 2),
    c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
 console.log(((R * c * 1000).toFixed()))