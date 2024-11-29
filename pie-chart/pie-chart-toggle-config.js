const pieChartToggleConfig = Object.create(basicPieChart);

pieChartToggleConfig.removeLocalStorageValue = function (value) {
  if (!value) {
    const filterValue = visApi().getSelectedValues(filterIdToogle);
    value = filterValue[0]?.[0] ?? "Цена";
  }
  const hiddenLegendItems = JSON.parse(localStorage.getItem(LOCALSTORAGE_NAME)) ?? {};
  hiddenLegendItems[value] = [];
  localStorage.setItem(LOCALSTORAGE_NAME, JSON.stringify(hiddenLegendItems));
};
pieChartToggleConfig.activeHiddenItem = function () {
  const hiddenLegendItems = JSON.parse(localStorage.getItem(LOCALSTORAGE_NAME)) ?? {};

  function activateItems(items, realChartId) {
    if (items) {
      let chart = Highcharts.charts.find((chart) => chart?.userOptions.chart.renderTo === realChartId);
      if (chart) {
        let elements = chart.legend.allItems;
        items.forEach(function (item) {
          let itemName = item.replace(/\s/g, "").replace(/[\u200B-\u200D\uFEFF]/g, "");
          let elementToActivate = elements.find(
            (elem) => elem.name.replace(/\s/g, "").replace(/[\u200B-\u200D\uFEFF]/g, "") === itemName
          );
          if (elementToActivate) {
            elementToActivate.legendGroup.element.onclick();
          }
        });
      }
    }
  }

  activateItems(hiddenLegendItems["Цена"], realChartId);
  activateItems(hiddenLegendItems["Количество"], realChartIdQuantity);
};

pieChartToggleConfig.legendHandler = function (value) {
  wigetId.find(".highcharts-legend").on("click", function () {
    const selectItem = [];
    const elem = wigetId.find(".highcharts-legend-item");
    for (let i = 0; i < elem.length; i++) {
      if (elem[i].classList.contains("highcharts-legend-item-hidden")) {
        selectItem.push(elem[i].textContent);
      }
    }
    if (!value) {
      const filterValue = visApi().getSelectedValues(filterIdToogle);
      value = filterValue[0]?.[0] ?? "Цена";
    }
    const hiddenLegendItems = JSON.parse(localStorage.getItem(LOCALSTORAGE_NAME)) ?? {};
    hiddenLegendItems[value] = [...new Set(selectItem)];
    localStorage.setItem(LOCALSTORAGE_NAME, JSON.stringify(hiddenLegendItems));
  });
};

pieChartToggleConfig.setHiddenItem = function (flag = true, value) {
  var elements = document.getElementById(w.general.renderTo).querySelectorAll(".highcharts-legend-item");
  const hiddenLegendItems = JSON.parse(localStorage.getItem(LOCALSTORAGE_NAME)) ?? {};
  if (!value) {
    const filterValue = visApi().getSelectedValues(filterIdToogle);
    value = filterValue[0]?.[0] ?? "Цена";
  }
  if (hiddenLegendItems[value]) {
    hiddenLegendItems[value].forEach(function (item) {
      for (var i = 0; i < elements.length; i++) {
        if (elements[i].textContent === item) {
          var event = new MouseEvent("click", {
            view: window,
            bubbles: true,
            cancelable: flag,
          });
          elements[i].dispatchEvent(event);
        }
      }
    });
  }
};

pieChartToggleConfig.updateDataWithCategories = function (seriesData) {
  return seriesData.data.map((i) => {
    const index = categories.findIndex((n) => n === i.names[0]);
    if (index !== -1) {
      i.legendIndex = index;
      i.color = w.colors[index];
    }
    return i;
  });
};

pieChartToggleConfig.sortArrayBasedOnAnother = function (sorted, notSorted) {
  const sortedNames = sorted.map((item) => item.names[0]);
  const sortedIndexMap = new Map(sortedNames.map((name, index) => [name, index]));

  notSorted.sort((a, b) => {
    const indexA = sortedIndexMap.get(a.names[0]);
    const indexB = sortedIndexMap.get(b.names[0]);
    return indexA - indexB;
  });

  return notSorted;
};

pieChartToggleConfig.sortedSeries = function (series) {
  series.data.sort((a, b) => {
    if (Number.isNaN(a.y) && Number.isNaN(b.y)) {
      return 0;
    }
    if (Number.isNaN(a.y)) {
      return 1;
    }
    if (Number.isNaN(b.y)) {
      return -1;
    }
    return b.y - a.y;
  });
  return series;
};
