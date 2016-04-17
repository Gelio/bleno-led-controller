const bleno = require('bleno');
const BlenoPrimaryService = bleno.PrimaryService;

const EchoCharacteristic = require('./echo-characteristic'),
    LedCharacteristic = require('./led-characteristic');
const LED = require('./led');

const pins = [22, 18, 27, 17, 4];

const leds = pins.map(pin => new LED(pin));

process.on('exit', cleanUp);
process.on('SIGINT', process.exit);
console.log('bleno - echo');


bleno.on('stateChange', function(state) {
    console.log('on -> stateChange: ' + state);

    if (state === 'poweredOn') {
        bleno.startAdvertising('led-controller', ['1ed0']);
    } else {
        bleno.stopAdvertising();
    }
});

bleno.on('advertisingStart', function(error) {
    console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

    if (!error) {
        bleno.setServices([
            new BlenoPrimaryService({
                uuid: '1ed1',
                characteristics: [
                    new LedCharacteristic(leds)
                ]
            })
        ]);
    }
});

function cleanUp() {
    console.log('Cleaning up');
    leds.forEach(led => led.switchOff());
}