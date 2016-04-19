const util = require('util'),
    EventEmitter = require('events').EventEmitter;

const frequency = 100;

function BrownianMotion(w, h, d, speed) {
    EventEmitter.call(this);

    this.w = w;
    this.h = h;
    this.d = d;

    this.range = speed;

    var a = this._a = {
        x: this.w / 2,
        y: this.h / 2,
        z: this.d / 2
    };

    var self = this;
    setInterval(function () {
        self.draw();
    }, frequency);
}
util.inherits(BrownianMotion, EventEmitter);

BrownianMotion.prototype.draw = function () {
    var a = this._a, range = this.range;

    // Put a new value at the end of the array
    var r2x = range * 2;
    a.x += (Math.random() * r2x) - range;
    a.y += (Math.random() * r2x) - range;
    a.z += (Math.random() * r2x) - range;

    // Constrain all povars to the screen
    a.x = this._constrain(a.x, 0, this.w);
    a.y = this._constrain(a.y, 0, this.h);
    a.z = this._constrain(a.z, 0, this.d);

    this.emit('data', a);

};

BrownianMotion.prototype._constrain = function (val, min, max) {
    if (val > max) {
        val = max;
    } else if (val < min) {
        val = min;
    }
    return val;
};

module.exports = BrownianMotion;
