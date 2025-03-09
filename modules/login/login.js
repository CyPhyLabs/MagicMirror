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
		const id = uuidv4();
		const password = uuidv4();
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
			width: 128,
			height: 128,
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
		}
		image.focus();

		return qrCodeDiv
	},

	connceted() {
		const thisModule = this;
		MM.getModules().enumerate(function(module) {
			if (module == thisModule) {
				module.hide(1000, function() {});
			} else {
				module.show(1000, function() {});
			}
		});
	},

	notificationReceived(notification, payload) {
		if (notification === "CONNECTED") {
		  this.ids = null;
		  this.updateDom();
		  this.connceted();
		}
	  }
});
