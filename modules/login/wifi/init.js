//
// Require bleno peripheral library.
// https://github.com/sandeepmistry/bleno
//
var bleno = require("@abandonware/bleno");

//
// The BLE wifi Service!
//
var WifiService = require("./wifi-service");
var config = null;

exports.init_ble = function(uuid, password, onconnect) {
  if (config) {
    config.password = password;
    config.onconnect = onconnect;
    return;
  }
  //
  // A name to advertise our wifi Service.
  //
  bleno.disconnect();
  bleno.stopAdvertising();
  var name = "Mirror";
  config = { password, onconnect };
  var wifiService = new WifiService(uuid, config);

  function start() {
    let uuid = wifiService.uuid;
    console.log(`Advertising with UUID: ${uuid} and name: ${name}`);
    bleno.startAdvertising(name, [uuid], function (err) {
      if (err) {
        console.log(err);
      }
    });
  }

  //
  // Wait until the BLE radio powers on before attempting to advertise.
  // If you don't have a BLE radio, then it will never power on!
  //
  bleno.on("stateChange", function (state) {
    if (state === "poweredOn") {
      //
      // We will also advertise the service ID in the advertising packet,
      // so it's easier to find.
      //
      bleInitialized = true;
      start();
    } else {
      console.log(`Stopping advertising due to state: ${state}`);
      bleno.stopAdvertising();
    }
  });

  bleno.on("advertisingStart", function (err) {
    if (!err) {
      console.log("advertising...");
      //
      // Once we are advertising, it's time to set up our services,
      // along with our characteristics.
      //
      bleno.setServices([wifiService]);
    }
  });
};
