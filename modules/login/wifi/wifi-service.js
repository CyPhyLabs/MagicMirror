const bleno = require("@abandonware/bleno");

const WifiCharacteristic = require("./wifi-characteristic");

class WifiService extends bleno.PrimaryService {
  constructor(uuid, password, onconnect) {
    super({
      uuid,
      characteristics: [
        new WifiCharacteristic(uuid, password, onconnect),
      ],
    });
  }
}

module.exports = WifiService;
