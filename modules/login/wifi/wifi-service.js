const bleno = require("@abandonware/bleno");

const WifiCharacteristic = require("./wifi-characteristic");

class WifiService extends bleno.PrimaryService {
  constructor(config) {
    super({
      uuid: "02DF056B-09A4-4E1E-B8D0-05E216CFA6A9",
      characteristics: [
        new WifiCharacteristic(config),
      ],
    });
  }
}

module.exports = WifiService;
