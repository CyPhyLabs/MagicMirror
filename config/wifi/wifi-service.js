const bleno = require("@abandonware/bleno");

const WifiCharacteristic = require("./wifi-characteristic");

class WifiService extends bleno.PrimaryService {
  constructor() {
    super({
      uuid: "13333333333333333333333333333337",
      characteristics: [
        new WifiCharacteristic(),
      ],
    });
  }
}

module.exports = WifiService;
