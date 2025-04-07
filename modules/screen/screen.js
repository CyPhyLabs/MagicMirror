Module.register("screen", {
	defaults: {},
  active_screen: 0,

  start () {
		Log.info(`Starting module: ${this.name}`);
		this.active_screen = 0;
    this.updateDom();
	},

	getScripts: function() {
		return [];
	},

	getStyles () {
		return [this.file("./styles/circle.css")];
	},

	getDom() {
		const main = document.createElement("div");
    let children = "";
    for (let i = 0; i < 2; i++) {
      if (i == this.active_screen) {
        children += `<div id="selected-circle"></div>`;
      } else {
        children += `<div id="unselected-circle"></div>`;
      }
    }
    console.log("children", children);
		main.innerHTML = `<div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
  <div style="display: flex; flex-direction: row; align-items: center; justify-content: center;">
    ${children}
  </div>
</div>`;

		return main;
	},

  notificationReceived: function(notification, payload, sender) {
    if (notification === "SCREEN_CHANGE") {
      this.active_screen = payload;
      this.updateDom();
    }
  }
});
