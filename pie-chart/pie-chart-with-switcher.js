const pieChartWithSwitcher = {
  switcherHandler(e, firstValue, secondValue) {
    localStorage.setItem("isChecked", e.target.checked);
    updateChart();
    pieChartToggleConfig.legendHandler();
    const value = e.target.checked ? [`${firstValue}`] : [`${secondValue}`];
    visApi().setFilterSelectedValues(switcherId, [value]);
    pieChartToggleConfig.setHiddenItem(false);
    pieChartToggleConfig.legendHandler();
    pieChartToggleConfig.activeHiddenItem();
  },

  addSwitcher(selector, firstValue, secondValue) {
    const switcher = document.createElement("div");
    switcher.classList.add("switcher-inner-container");
    switcher.innerHTML = `
             <div class="switcher-container">
                 <p>${firstValue}</p>
                 <input class="switcher-input" type="checkbox" id="switch"/><label for="switch" class="switcher-label"></label>
                 <p>${secondValue}</p>
             </div>
         `;
    const switchStyle = document.createElement("style");
    switchStyle.innerHTML = `
           
         `;
    document.querySelector("head").append(switchStyle);
    const widget = document.getElementById(w.general.renderTo);
    const container = widget.querySelector(selector);
    container?.after(switcher);
    const switcherInput = widget.querySelector(".switcher-input");
    const isCheckedValue = JSON.parse(localStorage.getItem("isChecked"));
    if (isCheckedValue) {
      switcherInput.setAttribute("checked", true);
    }
    switcherInput?.addEventListener("change", pieChartWithSwitcher.switcherHandler);
  },
};
