const barChart = {
  removeItems() {
    widgetId.find(".chart-zoom-" + w.general.renderTo).remove();
    widgetId.find(".chart-zoom-level-dynamics-" + w.general.renderTo).remove();
    $(".body-chart-" + w.general.renderTo).remove();
    $(".header-chart-" + w.general.renderTo).remove();
  },
  createTitleLabel(type) {
    widgetId.find(".chart-title-horizont-label").remove();
    widgetId.find(".chart-title-horizont-label-" + w.general.renderTo).remove();
    const titleLabel = document.createElement("div");
    const isZoomed = document.getElementById(w.general.renderTo).classList.contains("modal");
    titleLabel.className = isZoomed
      ? "chart-title-horizont-label chart-title-horizont-label-toZoom"
      : "chart-title-horizont-label";
    titleLabel.innerHTML = type;
    document.querySelector("#widget-header-" + w.general.renderTo).append(titleLabel);
  },
  convertAxisAdaptiveLabel(value, max, type) {
    const fixed = 2;
    if (max < 1000) {
      createTitleLabel(" " + type);
      return addSpaceFixed(value, fixed);
    }
    if (max < 1000000) {
      createTitleLabel(" тыс " + type);
      return addSpaceFixed(Math.round(value / 10) / 100, fixed);
    }
    if (max < 1000000000) {
      createTitleLabel(" млн " + type);
      return addSpaceFixed(Math.round(value / 10000) / 100, fixed);
    }
    if (max < 1000000000000) {
      createTitleLabel(" млрд " + type);
      return addSpaceFixed(Math.round(value / 10000000) / 100, fixed);
    }
    createTitleLabel(" трлн " + type);
    return addSpaceFixed(Math.round(value / 10000000000) / 100, fixed);
  },
  vidgetStyle() {
    w.drilldown.activeAxisLabelStyle.fontFamily = "Roboto";
    w.drilldown.activeDataLabelStyle.fontFamily = "Roboto";
    w.legend.itemStyle.fontFamily = "Roboto";
    w.plotOptions.series.dataLabels.style.fontFamily = "Roboto";
    w.xAxis.title.style.fontFamily = "Roboto";
    w.yAxis.title.style.fontFamily = "Roboto";
    w.xAxis.labels.style.fontFamily = "Roboto";
    w.yAxis.labels.style.fontFamily = "Roboto";
    w.tooltip.style.fontFamily = "Roboto";
  },
   saveValues(value, key) {
    let obj = JSON.parse(localStorage.getItem(LOCALSTORAGE_NAME));
  
    if (!obj) {
      obj = { price: [], quantity: []};
    }
  
    obj[key].push(value);
  
    localStorage.setItem(LOCALSTORAGE_NAME, JSON.stringify(obj));
  },
  
   removeValues(value, key) {
    let obj = JSON.parse(localStorage.getItem(LOCALSTORAGE_NAME));
    if(obj) {
        obj[key] = obj[key].filter(i => i[0] !== value[0])
    }
    localStorage.setItem(LOCALSTORAGE_NAME, JSON.stringify(obj));
  }
};
