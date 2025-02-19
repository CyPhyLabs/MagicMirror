Module.register("login", {
	defaults: {},
	svg: null,
	ids: null,

	getScripts: function() {
		return [
		  'qrcode.min.js', // https://github.com/davidshimjs/qrcodejs
		];
	},

	async start () {
		Log.info(`Starting module: ${this.name}`);
		this.generateQrCode();
		setInterval(() => this.generateQrCode(), 60000);
	},

	generateQrCode() {
		const rand = new Uint32Array(2);
		self.crypto.getRandomValues(rand);
		const id = rand[0];
		const password = rand[1];
		self.ids = { id, password };

		this.sendSocketNotification("START_BLE", self.ids)
		this.updateDom();
	},

	getDom() {
		if (!self.ids) {
			return document.createElement("div");
		}
		const qrCodeDiv = document.createElement("div");
		const text = JSON.stringify(self.ids);
		console.log(text);
		const qrOptions = {
			text,
			width: 128,
			height: 128,
			colorDark : "#000000",
			colorLight : "#ffffff",
			correctLevel: QRCode.CorrectLevel.H
		};
		
		new QRCode(qrCodeDiv, qrOptions);

		return qrCodeDiv
	},

	notificationReceived(notification, payload) {
		if (notification === "CONNECTED") {
		  this.ids = null;
		  this.updateDom()
		}
	  }
});
