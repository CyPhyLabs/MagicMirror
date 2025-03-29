Module.register("breathe", {
	defaults: {},

	getScripts: function() {
		return [];
	},

	getStyles () {
		return [this.file("./styles/animation.css")];
	},

	async start () {},

	getDom() {
		const main = document.createElement("div");
		main.innerHTML = `<div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
  <div style="display: flex; flex-direction: row; align-items: center; justify-content: center;">
    <h1>Slow down your breathing</h1>
  </div>
  <div style="display: flex; flex-direction: row; align-items: center; justify-content: center;">
    <span>(press enter to return)</span>
  </div>
  <div style="display: flex; flex-direction: row; align-items: center; justify-content: center;">
    <div style="position:relative; width: 300px; height: 300px">
      <div id="circle"></div>
      <div id="circle"></div>
      <div id="circle"></div>
      <div id="circle"></div>
      <div id="circle"></div>
      <div id="circle"></div>
      <div id="circle"></div>
      <div id="circle"></div>
      <div id="circle"></div>
      <div id="circle"></div>
      <div id="in">Inhale</div>
      <div id="out">Exhale</div>
    </div>
  </div>
</div>`;

		return main;
	}
});
