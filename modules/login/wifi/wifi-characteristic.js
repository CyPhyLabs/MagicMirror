const bleno = require("@abandonware/bleno");
const wifi = require("./wifi");

class WifiCharacteristic extends bleno.Characteristic {
  constructor(uuid, password, onconnect) {
    super({
      uuid,
      properties: ["write"],
      descriptors: [
        new bleno.Descriptor({
          uuid: "2901",
          value: "Logs into the wifi network.",
        }),
      ],
    });
    this.password = password;
    this.onconnect = onconnect;
  }

  onWriteRequest(data, offset, withoutResponse, callback) {
    if (offset) {
      callback(this.RESULT_ATTR_NOT_LONG);
    } else if (data.length !== 1) {
      callback(this.RESULT_INVALID_ATTRIBUTE_LENGTH);
    } else {
      try {
        const json = data.toString("utf-8");
        const { ssid, password, qrcode_password, token } = JSON.parse(json);
        // Only accept the connection if it contains the unique qrcode
        // password
        if (qrcode_password != this.password) {
          return;
        }
        console.log(`token to connect to authenticate with backend: ${token}`);
        wifi.connect(ssid, password, () => {
          callback(this.RESULT_SUCCESS);
          this.onconnect();
        });
      } catch (e) {
        console.error(e);
        callback(this.RESULT_UNLIKELY_ERROR);
      }
    }
  }
}

module.exports = WifiCharacteristic;
