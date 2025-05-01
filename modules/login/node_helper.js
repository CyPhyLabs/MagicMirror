const fs             = require("fs");
const path           = require("path");
const { app, safeStorage } = require("electron");
const NodeHelper     = require("node_helper");
const { init_ble }   = require("./wifi/init.js");
const wifi = require("./wifi/wifi.js");

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

function writeCachedToken(token, ssid, password) {
  try {
    if (!safeStorage.isEncryptionAvailable()) return; // nothing to do
    const encrypted = safeStorage.encryptString(JSON.stringify({ token, ssid, password }));
    fs.writeFileSync(getCachePath(), encrypted);
  } catch (err) {
    console.warn("Token cache write failed:", err.message);
  }
}

module.exports = NodeHelper.create({
  socketNotificationReceived(notification, payload) {
    if (notification !== "START_BLE") return;

    const cachedData = readCachedToken();
    // const cachedData = {
    //   ssid: "A1B2C3D4",
    //   password: "bluegreenberry",
    //   token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2MTU4MzY3NCwiaWF0IjoxNzQ2MDMxNjc0LCJqdGkiOiI4MjNjNTgwYzBkNmM0ZmM5YjZlZTRhMTE0ODJjYzM1OCIsInVzZXJfaWQiOiJjNTQyM2Q1OC01N2YyLTQwYTItOGQ0Ni03ODhkOWU0OGM0MzgifQ.QAZ_lpViNAknbZOwwQCDrpfoPu8wZCwQ5vNVw9b063g"
    // }
    if (cachedData) {
      let { ssid, password, token } = cachedData;
      console.log("Token cache hit:", cachedData);
      if (token && password && ssid) {
        wifi.connect(ssid, password, () => {
          console.log("Connected to WiFi:", ssid);
        });
        this.sendSocketNotification("CONNECTED", { token });
        return;
      }
    }

    const { id, password } = payload;
    init_ble(id, String(password), (freshToken, ssid, password) => {
        console.log("Token cache miss:", freshToken);
      writeCachedToken(freshToken, ssid, password);
      this.sendSocketNotification("CONNECTED", { token: freshToken });
    });
  },
});
