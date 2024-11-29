const utilsFunctions = {
  convertAxisAdaptive(value, max, type = '') {
    const fixed = 0;
    if (max < 1000000) {
      return utilsFunctions.addSpaceFixed(value, fixed) + " " + type;
    }
    if (max < 1000000) {
      return utilsFunctions.addSpaceFixed(value, 0) + " " + type;
    }
    if (max < 1000000000) {
      return utilsFunctions.addSpaceFixed(Math.round(value / 10000) / 100, fixed) + " млн " + type;
    }
    if (max < 1000000000000) {
      return utilsFunctions.addSpaceFixed(Math.round(value / 10000000) / 100, fixed) + " млрд " + type;
    }
    return utilsFunctions.addSpaceFixed(Math.round(value / 10000000000) / 100, fixed) + " трлн " + type;
  },
  convertAxisAdaptiveForNegative(value, max) {
    const fixed = 2;
    let sign = 1;
    if (max < 0) {
      sign = -1;
      max *= -1;
      value *= -1;
    }
    if (max < 1000) {
      return addSpaceFixed(value * sign, fixed);
    }
    if (max < 1000000) {
      return addSpaceFixed(value * sign, 0);
    }
    if (max < 1000000000) {
      return addSpaceFixed(Math.round(value / 10000) / 100 * sign, fixed);
    }
    if (max < 1000000000000) {
      return addSpaceFixed(Math.round(value / 10000000) / 100 * sign, fixed);
    }
    return addSpaceFixed(Math.round(value / 10000000000) / 100 * sign, fixed);
  },
  addSpaceFixed(value, fixed) {
    return value
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
      .replace(".", ",")
      .replace(/,00/g, "");
  },
// нужно проверить используется ли часто, можно ее заменить 
  getYValues(data) {
    const yValues = [];
    data.forEach((item) => {
      item.data.forEach((dataItem) => {
        yValues.push(dataItem.y);
      });
    });
    return yValues;
  },
  extendObj(obj1, obj2) {
    for (let a in obj2) {
      obj1[a] = obj2[a];
    }
    return obj1;
  },
  replaceZerosWithNaN(data) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].data) {
        for (let j = 0; j < data[i].data.length; j++) {
          if (data[i].data[j].y === 0) {
            data[i].data[j].y = NaN;
          }
        }
      }
    }
    return data;
  },
  showMessage(series, id) {
    if(series.data.every((i) => i.y === 0 || isNaN(i.y))) {
      document.getElementById(id).innerHTML = `
      <div 
          style="position: absolute;
          top: 50%; 
          width: 100%; 
          color: #828282; 
          font-size: 25px;
          font-family: 'Roboto';
          text-align: center;
          transform: translateY(-50%);
          -webkit-transform: translateY(-50%);"
      >Нет данных, удовлетворяющих условиям фильтрации</div>` 
      return false
  } else { 
      return true
  }
  },
  addZoomIcon(id) {
    const headerContainer = wigetId.find(".va-widget-header-container");
    const zoom = document.createElement("svg");
    zoom.className = "chart-pie-" + id;
    zoom.style.paddingLeft = document.getElementById(id).classList.contains("modal") ? "15px" : "10px";
    zoom.innerHTML = document.getElementById(id).classList.contains('modal') ? zoomOutIcon : zoomInIcon;
    zoom.style.cursor = "pointer";

    headerContainer.prepend(zoom);
  },
  measureUnit(value) {
    if (value < 0) {
      value = Math.abs(value);
    }
    switch (true) {
      case value < 1000:
        return " ";
      case value < 1000000:
        return " ";
      case value < 1000000000:
        return " млн ";
      case value < 1000000000000:
        return " млрд ";
      default:
        return " трлн ";
    }
  },
  measureUnitWithLabel(value, thousandsLabel) {
    if(value < 0) {
        value = Math.abs(value)
    }
    switch (true) {
      case value < 1000:
        return ' ';
      case value < 1000000:
        return thousandsLabel ? ' тыс ' : ' '
      case value < 1000000000:
        return ' млн ';
      case value < 1000000000000:
        return ' млрд ';
      default:
        return ' трлн ';
    }
  },
  copy(aObject) {
    const bObject = Array.isArray(aObject) ? [] : {};
  
    let value;
    for (let key in aObject) {
      value = aObject[key];
      bObject[key] = typeof value === 'object' ? copy(value) : value;
    }
  
    return bObject;
  },
  upadateTextSize() {
    const isZoomed = document.getElementById(w.general.renderTo).classList.contains('modal');
    widgetId.find('.va-widget-header')[0].style.fontSize = isZoomed ? '26px' : '21px';
    w.legend.itemStyle.fontSize = isZoomed ? labelFontSizeZoom : labelFontSize;
    w.tooltip.style.fontSize = isZoomed ? labelFontSizeZoom : labelFontSize;
    w.plotOptions.series.dataLabels.style.fontSize = isZoomed ? labelFontSizeZoom : labelFontSize;
    w.xAxis.labels.style.fontSize = isZoomed ? labelFontSizeZoom : labelFontSize;
    w.xAxis.title.style.fontSize = isZoomed ? labelFontSizeZoom : labelFontSize;
    w.yAxis.labels.style.fontSize = isZoomed ? labelFontSizeZoom : labelFontSize;
    w.yAxis.stackLabels.style.fontSize = isZoomed ? labelFontSizeZoom : labelFontSize;
  }
};