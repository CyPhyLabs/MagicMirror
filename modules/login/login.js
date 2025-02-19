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

		return qrCodeDiv
	},

	notificationReceived(notification, payload) {
		if (notification === "CONNECTED") {
		  this.ids = null;
		  this.updateDom()
		}
	  }
});
