const bleno = require("@abandonware/bleno");

const WifiCharacteristic = require("./wifi-characteristic");

class WifiService extends bleno.PrimaryService {
  constructor(uuid, config) {
    super({
      uuid,
      characteristics: [
        new WifiCharacteristic(config),
      ],
    });
  }
}

module.exports = WifiService;
