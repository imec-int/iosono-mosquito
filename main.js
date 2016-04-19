var osc = require("osc");

// Get command line parameters
var args = process.argv.slice(2);

var DESTINATION_HOST = args[0] || '192.168.0.1',
    DESTINATION_PORT = args[1] || 4243,
    CHANNEL = args[2] || 0;

// osc sender
var udpPort = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: 5001
});

// Open the socket.
udpPort.open();


// Establish flight simulation
const BrownianMotion = require('./BrownianMotion');

var obj = new BrownianMotion(2.4, 6, 2.2, 0.1);

// Output trajectory as JSON
console.log('[');
process.on('SIGINT', () => {
  console.log(']');
  process.exit(0);
});

var first = true;
obj.on('data', function (c) {
    var sphereC = cartesian2Spherical(c.x - 1.2, c.y - 3, c.z);

    console.log(first ? '': ',',JSON.stringify(c));
    first = false;

    sendToIosono(sphereC);
})

//Convert coordinates
function cartesian2Spherical(x, y, z) {
    var r = Math.sqrt(x * x + y * y + z * z);
    var theta = Math.atan2(y, x); //This takes y first
    var phi = Math.atan2(Math.sqrt(x * x + y * y), z);

    return {
        r: r,
        theta: theta,
        phi: phi
    };
}

function sendToIosono(position) {
    // Send an OSC message to, say, SuperCollider
    udpPort.send({
        address: "/iosono/renderer/version1/src",
        args: [{
            type: "i",
            value: CHANNEL
        }, {
            type: "i",
            value: 4
        }, {
            type: "f",
            value: position.theta
        }, {
            type: "f",
            value: position.phi
        }, {
            type: "f",
            value: position.r
        }, {
            type: "f",
            value: 0.75
        }, {
            type: "f",
            value: 0.75
        }, {
            type: "f",
            value: 0
        }, {
            type: "i",
            value: 0
        }, {
            type: "i",
            value: 0
        }, {
            type: "f",
            value: 0
        }, {
            type: "i",
            value: 0
        }]
    }, DESTINATION_HOST, DESTINATION_PORT);
}
