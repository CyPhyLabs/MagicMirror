let { init_ble } = require("./wifi/init.js");

const NodeHelper = require("node_helper");
module.exports = NodeHelper.create({
    socketNotificationReceived: function(notification, payload) {
        console.log(notification);
        if (notification === "START_BLE") {
            let {password} = payload;
            const passwordString = password.toString();
            init_ble(passwordString, () => {
                this.sendSocketNotification("CONNECTED", {})
            });
        }
    },
});
