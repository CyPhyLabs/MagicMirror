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
				thisModule.connceted();
			}
			if (e.key === "Tab") {
				thisModule.showBreathe();
			}
		}
		image.focus();

		return qrCodeDiv
	},

	showBreathe() {
		MM.getModules().enumerate(function(module) {
			if (module.name === "breathe") {
				module.show(1000, function() {});
			} else {
				module.hide(1000, function() {});
			}
		});
	},

	connceted() {
		const thisModule = this;
		MM.getModules().enumerate(function(module) {
			if (module == thisModule || module.name === "breathe") {
				module.hide(1000, function() {});
			} else {
				module.show(1000, function() {});
			}
		});
	},

	socketNotificationReceived(notification, payload) {
		console.log("notificationReceived", notification, payload);
		if (notification === "CONNECTED") {
		  this.ids = null;
		  this.updateDom();
		  this.connceted();
		}
	  }
});
