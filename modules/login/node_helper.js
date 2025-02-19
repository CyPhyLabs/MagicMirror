import { init_ble } from require("./wifi/init.js");

const NodeHelper = require("node_helper");
module.exports = NodeHelper.create({
    async socketNotificationReceived(notification, payload) {
        if (notification === "START_BLE") {
            let {id, password} = payload;
            init_ble(id, password, () => {
                this.sendSocketNotification("CONNECTED", {})
            });
        }
    },
});
