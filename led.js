var Gpio = require('onoff').Gpio;

function LED(pin) {
    this.pin = pin;
    this.gpio = new Gpio(pin, 'out');
    this.status = 0;

    this.switchOff();
}

LED.prototype.switchOn = function () {
    if (this.status === 0) {
        this.gpio.writeSync(1);
        this.status = 1;
    }
};

LED.prototype.switchOff = function () {
    if (this.status === 1) {
        this.gpio.writeSync(0);
        this.status = 0;
    }
};

module.exports = LED;