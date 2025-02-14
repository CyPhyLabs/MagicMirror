//
// Require bleno peripheral library.
// https://github.com/sandeepmistry/bleno
//
var bleno = require("@abandonware/bleno");

//
// The BLE wifi Service!
//
var WifiService = require("./wifi-service");

exports.init_ble = function() {
  //
  // A name to advertise our wifi Service.
  //
  var name = "WifiMirror";
  var wifiService = new WifiService();

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
      let uuid = wifiService.uuid;
      bleno.startAdvertising(name, [uuid], function (err) {
        if (err) {
          console.log(err);
        }
      });
    } else {
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
