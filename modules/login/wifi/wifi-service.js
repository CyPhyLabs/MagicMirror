const bleno = require("@abandonware/bleno");

const WifiCharacteristic = require("./wifi-characteristic");

class WifiService extends bleno.PrimaryService {
  constructor(config) {
    super({
      uuid: "1337",
      characteristics: [
        new WifiCharacteristic(config),
      ],
    });
  }
}

module.exports = WifiService;
