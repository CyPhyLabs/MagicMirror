const wifi = require("node-wifi");

exports.connect = function (ssid, password, callback) {
  wifi.init({
    iface: null, // network interface, choose a random wifi interface if set to null
  });

  // Connect to a network
  wifi.connect({ ssid, password }, callback);
};
