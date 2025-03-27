const bleno = require("@abandonware/bleno");
const wifi = require("./wifi");

class WifiCharacteristic extends bleno.Characteristic {
  constructor(config) {
    super({
      uuid: "E9F04999-ADED-4C4A-80E2-C00B7EED30A0",
      properties: ["write"],
      descriptors: [
        new bleno.Descriptor({
          uuid: "2901",
          value: "Logs into the wifi network.",
        }),
      ],
    });
    this.config = config;
  }

  onWriteRequest(data, offset, withoutResponse, callback) {
    console.log("BLE received data!");
    if (offset) {
      callback(this.RESULT_ATTR_NOT_LONG);
    } else {
      try {
        console.log(`BLE received data: ${data}!`); 
        const json = data.toString("utf-8");
        console.log(`BLE received json: ${json}!`); 
        const { ssid, password, qrcode_password, token } = JSON.parse(json);
        // Only accept the connection if it contains the unique qrcode
        // password
        if (qrcode_password != this.config.password) {
          console.log("qrcode_password does not match");
          return;
        }
        console.log(`token to connect to authenticate with backend: ${token}`);
        wifi.connect(ssid, password, () => {
          callback(this.RESULT_SUCCESS);
          console.log('connected!!!');
          this.config.onconnect();
        });
      } catch (e) {
        console.error(e);
        callback(this.RESULT_UNLIKELY_ERROR);
      }
    }
  }
}

module.exports = WifiCharacteristic;
