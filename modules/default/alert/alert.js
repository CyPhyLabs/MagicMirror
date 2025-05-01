/* global NotificationFx */

Module.register("alert", {
	alerts: {},

	defaults: {
		effect: "slide", // scale|slide|genie|jelly|flip|bouncyflip|exploader
		alert_effect: "jelly", // scale|slide|genie|jelly|flip|bouncyflip|exploader
		display_time: 86400, // time a notification is displayed in seconds
		position: "left",
		welcome_message: false // shown at startup
	},

	getScripts () {
		return ["notificationFx.js"];
	},

	getStyles () {
		return ["font-awesome.css", this.file("./styles/notificationFx.css"), this.file(`./styles/${this.config.position}.css`)];
	},

	getTranslations () {
		return {
			bg: "translations/bg.json",
			da: "translations/da.json",
			de: "translations/de.json",
			en: "translations/en.json",
			es: "translations/es.json",
			fr: "translations/fr.json",
			hu: "translations/hu.json",
			nl: "translations/nl.json",
			ru: "translations/ru.json",
			th: "translations/th.json"
		};
	},

	getTemplate (type) {
		return `templates/${type}.njk`;
	},

	async start () {
		Log.info(`Starting module: ${this.name}`);

		if (this.config.effect === "slide") {
			this.config.effect = `${this.config.effect}-${this.config.position}`;
		}

		if (this.config.welcome_message) {
			const message = this.config.welcome_message === true ? this.translate("welcome") : this.config.welcome_message;
			await this.showNotification({ title: this.translate("sysTitle"), message });
		}
	},

	notificationReceived (notification, payload, sender) {
		if (notification === "SET_TOKEN") {
			this.token = payload.token;
		} else if (notification === "SHOW_ALERT") {
			if (this.token) {
				if (payload.type === "notification") {
					this.showNotification(payload);
				} else {
					this.showAlert(payload, sender);
				}
			}
		} else if (notification === "HIDE_ALERT") {
			this.hideAlert(sender);
		} else if (notification === "DOM_OBJECTS_CREATED") {
			// spawn a loop in the background that polls the backend for new messages
			setInterval(() => {
				this.pollMessages();
			}, 60000);
		}
	},

	async showNotification (notification) {
		const message = await this.renderMessage(notification.templateName || "notification", notification);

		new NotificationFx({
			message,
			layout: "growl",
			effect: this.config.effect,
			ttl: notification.timer || this.config.display_time
		}).show();
	},

	async showAlert (alert, sender) {
		// If module already has an open alert close it
		if (this.alerts[sender.name]) {
			this.hideAlert(sender, false);
		}

		// Add overlay
		if (!Object.keys(this.alerts).length) {
			this.toggleBlur(true);
		}

		const message = await this.renderMessage(alert.templateName || "alert", alert);

		// Store alert in this.alerts
		this.alerts[sender.name] = new NotificationFx({
			message,
			effect: this.config.alert_effect,
			ttl: alert.timer,
			onClose: () => this.hideAlert(sender),
			al_no: "ns-alert"
		});

		// Show alert
		this.alerts[sender.name].show();

		// Add timer to dismiss alert and overlay
		if (alert.timer) {
			setTimeout(() => {
				this.hideAlert(sender);
			}, alert.timer);
		}
	},

	hideAlert (sender, close = true) {
		// Dismiss alert and remove from this.alerts
		if (this.alerts[sender.name]) {
			this.alerts[sender.name].dismiss(close);
			delete this.alerts[sender.name];
			// Remove overlay
			if (!Object.keys(this.alerts).length) {
				this.toggleBlur(false);
			}
		}
	},

	renderMessage (type, data) {
		return new Promise((resolve) => {
			this.nunjucksEnvironment().render(this.getTemplate(type), data, function (err, res) {
				if (err) {
					Log.error("Failed to render alert", err);
				}

				resolve(res);
			});
		});
	},

	toggleBlur (add = false) {
		const method = add ? "add" : "remove";
		const modules = document.querySelectorAll(".module");
		for (const module of modules) {
			module.classList[method]("alert-blur");
		}
	},

	pollMessages () {
		// Message format:
		// [
		//		{
		//			"message": {
		//				"body": "This is a new message",
		//				"title": "New Message Title",
		//				"priority": "low",
		//				"created_by": "85a35446-cb9a-4968-8e47-7b2d8b2b3cce",
		//				"message_id": "6817cbbe-8158-4f4b-b6ea-1743c0e1ea7b"
		//			},
		//			"target_audience": "everyone"
		//		}
		// ]
		fetch("http://localhost:8080/cors?url=https://backend-dev-hosted.onrender.com/api/messages")
			.then((response) => {
				if (!response.ok) {
					throw new Error(`HTTP error: ${response.status}`);
				}
				return response.json();
			})
			.then((json) => {
				this.setMessages(json);
			})
			.catch((error) => {
				console.log(error);
			});
	},

	setMessages (messages) {
		let oldMessages = 0;
		if (this.messages) {
			oldMessages = this.messages.length;
		}
		this.messages = messages;
		for (let i = oldMessages; i < messages.length; i++) {
			const message = messages[i];
			this.notificationReceived("SHOW_ALERT", {
				type: "notification",
				title: message["message"]["title"],
				message: message["message"]["body"],
			}, this);
		}
	}
});
