Module.register("login", {
	defaults: {},
	svg: null,
	ids: null,

	getScripts: function() {
		return [
		  'qrcode.min.js', // https://github.com/davidshimjs/qrcodejs
		  'uuid.min.js', // https://cdn.jsdelivr.net/npm/uuid/+esm
		];
	},

	async start () {
		Log.info(`Starting module: ${this.name}`);
		this.generateQrCode();
		setInterval(() => this.generateQrCode(), 60000);
	},

	generateQrCode() {
		const password = uuidv4();
		let id = null;
		if (this.ids) {
			id = this.ids.id;
		}
		if (id == null) {
			id = uuidv4();
		}
		this.ids = { id, password };

		this.sendSocketNotification("START_BLE", this.ids)
		this.updateDom();
	},

	getDom() {
		if (!this.ids) {
			return document.createElement("div");
		}
		const qrCodeDiv = document.createElement("div");
		const textNode = document.createElement("pre");
		let textContents = document.createTextNode("Scan the QR code below\nwith the Smart Reflect app\nto get started");
		textNode.appendChild(textContents);
		qrCodeDiv.appendChild(textNode);
		const text = JSON.stringify(this.ids);
		console.log(text);
		// TODO: use deeplink instead of text to use deeplinking
		let deeplink = `mirror://wifi?json=${encodeURIComponent(text)}`;
		console.log(deeplink);
		const qrOptions = {
			text,
			width: 512,
			height: 512,
			colorDark : "#000000",
			colorLight : "#ffffff",
			correctLevel: QRCode.CorrectLevel.H
		};
		
		new QRCode(qrCodeDiv, qrOptions);
		let image = qrCodeDiv.querySelector("img");
		image.style.marginLeft = "auto";
		image.style.marginRight = "auto";
		image.style.textAlign = "center";
		const thisModule = this;
		window.onkeyup = function(e) {
			if (e.key === "Enter") {
				let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ1NDM2OTYxLCJpYXQiOjE3NDU0MzMzNjEsImp0aSI6IjhjZDc4NjQxMjJmYjRkMWVhMTkwODg0MWY1NGQ4OGVmIiwidXNlcl9pZCI6IjVmYWI5YjFkLTEzOGEtNGQxMC04ZWVjLWEwNzEzYTlmZjRhOSJ9.SIsnMr5xX6QrSP9SgXWDJvdK4WA1QVOUPMQInPzB7Yc";
				thisModule.sendNotification("SET_TOKEN", { token });
				thisModule.connceted();
			}
			if (e.key === "Tab") {
				thisModule.showBreathe();
			}
			if (e.key === "Shift") {
				thisModule.showCalendar();
			}
		}
		image.focus();

		return qrCodeDiv
	},

	showCalendar() {
		this.sendNotification("SCREEN_CHANGE", 2);
		MM.getModules().enumerate(function(module) {
			if (module.name === "fullscreencalendar" || module.name === "screen") {
				module.show(1000, function() {});
			} else {
				module.hide(1000, function() {});
			}
		});
	},

	showBreathe() {
		this.sendNotification("SCREEN_CHANGE", 1);
		MM.getModules().enumerate(function(module) {
			if (module.name === "breathe" || module.name === "screen") {
				module.show(1000, function() {});
			} else {
				module.hide(1000, function() {});
			}
		});
	},

	connceted() {
		this.sendNotification("SCREEN_CHANGE", 0);
		const thisModule = this;
		MM.getModules().enumerate(function(module) {
			if (module == thisModule || module.name === "breathe" || module.name === "fullscreencalendar") {
				module.hide(1000, function() {});
			} else {
				module.show(1000, function() {});
			}
		});
	},

	socketNotificationReceived(notification, payload) {
		if (notification === "CONNECTED") {
		  this.ids = null;
		  this.updateDom();
		  this.connceted();
		  this.sendNotification("SET_TOKEN", { token: payload.token });
		}
	  }
});
