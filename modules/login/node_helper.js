let { init_ble } = require("./wifi/init.js");

const NodeHelper = require("node_helper");
module.exports = NodeHelper.create({
    socketNotificationReceived: function(notification, payload) {
        console.log(notification);
        if (notification === "START_BLE") {
            let {id, password} = payload;
            const idString = id.toString();
            const passwordString = password.toString();
            init_ble(idString, passwordString, () => {
                this.sendSocketNotification("CONNECTED", {})
            });
        }
    },
});
