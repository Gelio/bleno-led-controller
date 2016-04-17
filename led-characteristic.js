'use strict';

const util = require('util');
const bleno = require('bleno');

function LedCharacteristic(leds) {
    LedCharacteristic.super_.call(this, {
        uuid: '1ed2',
        properties: ['read', 'write'],
        value: null
    });

    this.leds = leds;

    const LedStatusArray = this.leds.map(led => led.status)
        .join('');
    this._value = new Buffer(LedStatusArray);
    this._updateValueCallback = null;


}
util.inherits(LedCharacteristic, bleno.Characteristic);

LedCharacteristic.prototype.onReadRequest = function (offset, callback) {
    console.log('LED characteristic: sending data back', this._value);

    callback(this.RESULT_SUCCESS, this._value);
};

LedCharacteristic.prototype.onWriteRequest = function (data, offset, withoutResponse, callback) {
    let ledStatus = data.toString().split('')
        .map(status => Number(status));

    console.log('LED characteristic: fetching new data - ', ledStatus);

    if(ledStatus.length !== this.leds.length) {
        console.log('LED characteristic: Invalid length');
        return callback(this.RESULT_INVALID_ATTRIBUTE_LENGTH);
    }

    this._value = data;
    ledStatus.forEach((status, index) => {
        if(status === 1)
            this.leds[index].switchOn();
        else
            this.leds[index].switchOff();
    });

    callback(this.RESULT_SUCCESS);
};

module.exports = LedCharacteristic;