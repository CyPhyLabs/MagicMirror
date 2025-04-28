const fs             = require("fs");
const path           = require("path");
const { app, safeStorage } = require("electron");
const NodeHelper     = require("node_helper");
const { init_ble }   = require("./wifi/init.js");

function getCachePath() {
  // MagicMirror runs inside Electron, so app.getPath works here.
  const userData = app.getPath("userData");
  return path.join(userData, "token.json");
}

function readCachedToken() {
  const file = getCachePath();
  console.log("looking for token cache at", file);
  try {
    if (!fs.existsSync(file) || !safeStorage.isEncryptionAvailable()) return null;

    const encrypted = fs.readFileSync(file);
    const decrypted = safeStorage.decryptString(encrypted).toString();
    const data = JSON.parse(decrypted);
    return data || null;
  } catch (err) {
    console.warn("Token cache read failed → ignoring:", err.message);
    return null;                       // fall through to fresh login
  }
}

function writeCachedToken(token) {
  try {
    if (!safeStorage.isEncryptionAvailable()) return; // nothing to do
    const encrypted = safeStorage.encryptString(JSON.stringify({ token }));
    fs.writeFileSync(getCachePath(), encrypted);
  } catch (err) {
    console.warn("Token cache write failed:", err.message);
  }
}

module.exports = NodeHelper.create({
  socketNotificationReceived(notification, payload) {
    if (notification !== "START_BLE") return;

    const cachedData = readCachedToken();
    if (cachedData) {
      let { ssid, password, token } = cachedData;
      wifi.connect(ssid, password, () => {
        callback(this.RESULT_SUCCESS);
      });
        console.log("Token cache hit:", cachedData);
      this.sendSocketNotification("CONNECTED", { token });
      return;
    }

    const { id, password } = payload;
    init_ble(id, String(password), (freshToken) => {
        console.log("Token cache miss:", freshToken);
      writeCachedToken(freshToken);
      this.sendSocketNotification("CONNECTED", { token: freshToken });
    });
  },
});
