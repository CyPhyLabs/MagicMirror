const bleno = require("@abandonware/bleno");
const wifi = require("./wifi");

class WifiCharacteristic extends bleno.Characteristic {
  constructor() {
    super({
      uuid: "13333333333333333333333333330001",
      properties: ["write"],
      descriptors: [
        new bleno.Descriptor({
          uuid: "2901",
          value: "Logs into the wifi network.",
        }),
      ],
    });
  }

  onWriteRequest(data, offset, withoutResponse, callback) {
    if (offset) {
      callback(this.RESULT_ATTR_NOT_LONG);
    } else if (data.length !== 1) {
      callback(this.RESULT_INVALID_ATTRIBUTE_LENGTH);
    } else {
      try {
        const json = data.toString("utf-8");
        const { ssid, password } = JSON.parse(json);
        wifi.connect(ssid, password, () => {
          callback(this.RESULT_SUCCESS);
        });
      } catch (e) {
        console.error(e);
        callback(this.RESULT_UNLIKELY_ERROR);
      }
    }
  }
}

module.exports = WifiCharacteristic;
