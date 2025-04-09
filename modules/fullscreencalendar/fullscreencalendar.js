Module.register("fullscreencalendar", {
	defaults: {},
  events: [],

  start () {
    this.events = [
      [{title: "Team Meeting 2pm"}],
    ];
    this.updateDom();
	},

	getScripts: function() {
		return [];
	},

	getStyles () {
		return [this.file("./styles/style.css")];
	},

	getDom() {
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    let month = currentDate.toLocaleString('default', { month: 'long' });
    let year = currentDate.getFullYear();
		const main = document.createElement("div");
    let children = `<div class="calendar-container"><div class="calendar-grid"><div class="calendar-header"><div class="month-year">${month} ${year}</div></div><div class="day-of-the-week">Sun</div><div class="day-of-the-week">Mon</div><div class="day-of-the-week">Tue</div><div class="day-of-the-week">Wed</div><div class="day-of-the-week">Thu</div><div class="day-of-the-week">Fri</div><div class="day-of-the-week">Sat</div>`;
    for (let previousDay = 30; previousDay < 32; previousDay++) {
      children+=`<div class="day other-month"><div class="day-number">${previousDay}</div></div>`
    }
    for (let day = 0; day < 30; day++) {
      if (day == currentDay) {
        children += `<div class="day today"><div style="display: flex; flex-direction: row"><span class="day-label">Today</span><div class="day-number">${day+1}</div></div>`;
      }else {
        children += `<div class="day"><div class="day-number">${day+1}</div>`;
      }
      const events = this.events[day];
      if (events) {
        for (const event of events) {
          children += `<div class="event">${event.title}</div>`;
        }
      }
      children += `</div>`;
    }
    for (let futureDay = 0; futureDay < 3; futureDay++) {
      children+=`<div class="day other-month"><div class="day-number">${futureDay+1}</div></div>`
    }
    children += '</div></div>';
		main.innerHTML = children;

		return main;
	},

  notificationReceived: function(notification, payload, sender) {
    if (notification === "UPDATE_EVENTS") {
      this.events = payload;
    }
  }
});
