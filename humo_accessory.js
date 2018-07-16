var Accessory = require('../').Accessory;
var Service = require('../').Service;
var Characteristic = require('../').Characteristic;
var uuid = require('../').uuid;
var fs = require('fs');

var SmokeValue = 0;

// MQTT Setup
var mqtt = require('mqtt');
console.log("HomeKit Smoke Sensor Connecting to MQTT broker...");
var mqtt = require('mqtt');
var options = {
port: 1883,
host: '192.168.0.56',
clientId: 'SmokeSensor'
};

var client = mqtt.connect(options);
client.subscribe('stat/SmokeSensor/POWER');
client.on('message', function(topic, message) {
if (topic == 'stat/SmokeSensor/POWER')
SmokeValue = parseFloat(message);
});

var SMOKE_SENSOR = {
getSmokeValue: function() {
SMOKE_SENSOR.SmokeDetected = SmokeValue;
return (SMOKE_SENSOR.SmokeDetected);
},
setSmokeValue: function() {
SMOKE_SENSOR.SmokeDetected = parseFloat(SmokeValue);
}
}

var sensorUUID = uuid.generate('hap-nodejs:accessories:SmokeSensor');
var sensor = exports.accessory = new Accessory('Smoke Sensor', sensorUUID);

sensor.username = "00:1D:3A:25:54:FF";
sensor.pincode = "031-45-154";

sensor
.getService(Service.AccessoryInformation)
.setCharacteristic(Characteristic.Manufacturer, "Lisergio")
.setCharacteristic(Characteristic.Model, "Sensor Humo V1")
.setCharacteristic(Characteristic.SerialNumber, "Li-001");

sensor
.addService(Service.SmokeSensor, "Smoke Sensor")
.getCharacteristic(Characteristic.SmokeDetected)
.on('get', function(callback) {
callback(null, SmokeValue);
});



client.on('message', function(topic, message) {
    console.log(String(message));
    if(String(message) == "ON"){
	SmokeValue=1;
//	SMOKE_SENSOR.getSmokeValue()
//	SMOKE_SENSOR.setSmokeValue()
	SMOKE_SENSOR.SmokeDetected = SmokeValue;
	sensor
	.getService(Service.SmokeSensor)
	.setCharacteristic(Characteristic.SmokeDetected, SMOKE_SENSOR.SmokeDetected);
    }else if(String(message) == "OFF"){
        SmokeValue=0;
//        SMOKE_SENSOR.getSmokeValue()
//        SMOKE_SENSOR.setSmokeValue() 
        SMOKE_SENSOR.SmokeDetected = SmokeValue;
        sensor
        .getService(Service.SmokeSensor)
        .setCharacteristic(Characteristic.SmokeDetected, SMOKE_SENSOR.SmokeDetected);
    }
});

