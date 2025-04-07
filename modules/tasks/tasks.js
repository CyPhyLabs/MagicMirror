Module.register("tasks", {
	defaults: {},
  tasks: [{
    title: "Water plants",
    completion: [false, false, true],
  }],

  start () {
    this.updateDom();
	},

	getScripts: function() {
		return [];
	},

	getStyles () {
		return [this.file("./styles/style.css")];
	},

	getDom() {
		const main = document.createElement("div");
    let children = '<div class="task-box"><div class="task-row"><div class="task-label"></div><div class="task-items"><div class="task-day">S</div><div class="task-day">M</div><div class="task-day">T</div><div class="task-day">W</div><div class="task-day">T</div><div class="task-day">F</div><div class="task-day">S</div></div></div>';
    for (const task of this.tasks) {
      children += `<div class="task-row"><div class="task-label">${task.title}</div><div class="task-items">`;
      for (let i = 0; i < 7; i++) {
        if (i == task.completion.length - 1) {
          children += `<div class="task-circle task-circle-wip"></div>`;
        } else
        if (i > task.completion.length - 1) {
          children += `<div class="task-circle"></div>`;
        } else if (task.completion[i]) {
          children += `<div class="task-circle task-circle-complete"></div>`;
        } else {
          children += `<div class="task-circle task-circle-incomplete"></div>`;
        }
      }
      children += '</div></div>';
    }
    children += '</div>';
    console.log("children", children);
		main.innerHTML = children;

		return main;
	},

  notificationReceived: function(notification, payload, sender) {}
});
