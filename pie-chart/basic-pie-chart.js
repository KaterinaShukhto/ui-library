const basicPieChart = {
  removeItems() {
    wigetId.find(".chart-pie-" + w.general.renderTo).remove();
    $(".body-pie-" + w.general.renderTo).remove();
    $(".header-pie-" + w.general.renderTo).remove();
  },
  checkEnabledLegendItem(selectedValues = 0) {
    const elem = document
      .getElementById(w.general.renderTo)
      .querySelectorAll(".highcharts-pie-series.highcharts-legend-item-hidden");
    if (elem.length > 0 || selectedValues.length > 0) {
      $("#widget-action-" + w.general.renderTo)
        .find(".va-widget-filter-btn")
        .css("display", "block");
    } else {
      $("#widget-action-" + w.general.renderTo)
        .find(".va-widget-filter-btn")
        .css("display", "none");
    }
  },
  upadateTextSize() {
    const isZoomed = document.getElementById(w.general.renderTo).classList.contains("modal");
    document.getElementById("widget-" + w.general.renderTo).style.zIndex = isZoomed ? "999" : "100";
    w.legend.itemStyle.fontSize = isZoomed ? "22px" : "14px";
    w.tooltip.style.fontSize = isZoomed ? "22px" : "14px";
    w.plotOptions.pie.dataLabels.style.fontSize = isZoomed ? "22px" : "16px";
  },
  legendHandler() {
    wigetId.find(".highcharts-legend").on("click", function () {
      const selectItem = [];
      const elem = wigetId.find(".highcharts-legend-item");
      for (let i = 0; i < elem.length; i++) {
        if (elem[i].classList.contains("highcharts-legend-item-hidden")) {
          selectItem.push(elem[i].textContent.replace(/[\u200B-\u200D\uFEFF]/g, ""));
        }
      }
      localStorage.setItem(LOCALSTORAGE_NAME, JSON.stringify([...new Set(selectItem)]));
    });
  },
  setHiddenItem() {
    document
      .getElementById(w.general.renderTo)
      .querySelectorAll(".highcharts-legend-item-hidden")
      .forEach((i) => {
        var event = new MouseEvent("click", {
          view: window,
          bubbles: true,
          cancelable: true,
        });
        i.dispatchEvent(event);
      });
    var elements = document.getElementById(w.general.renderTo).querySelectorAll(".highcharts-legend-item");
    const hiddenTenderer = JSON.parse(localStorage.getItem(LOCALSTORAGE_NAME));
    if (hiddenTenderer) {
      hiddenTenderer.forEach(function (item) {
        for (var i = 0; i < elements.length; i++) {
          if (
            elements[i].textContent.replace(/[\u200B-\u200D\uFEFF]/g, "").replace(/\s/g, "") === item.replace(/\s/g, "")
          ) {
            var event = new MouseEvent("click", {
              view: window,
              bubbles: true,
              cancelable: true,
            });
            elements[i].dispatchEvent(event);
          }
        }
      });
    }
  },
  fadeData() {
    var currentData = this;
    this.series.data.forEach(function (data) {
      if (currentData.id === data.id || data.state === "select") {
        data.update({ opacity: 1 }, false);
      } else {
        data.update({ opacity: 0.2 }, false);
      }
    });
    this.series.chart.redraw();
  },
  unclickAll() {
    let currentData = this;
    var unselectLength = 0;
    this.series.data.forEach(function (data) {
      if (data.selected && currentData.id !== data.id) {
        data.update({ opacity: 1 }, false);
      } else {
        unselectLength += 1;
        data.update({ opacity: 0.2 }, false);
      }
    });

    if (unselectLength === this.series.data.length) {
      this.series.data.forEach(function (data) {
        data.update({ opacity: 1 }, false);
      });
    }
    this.series.chart.redraw();
  },
};
