const tableBasicChart = {
  addSortArrow() {
    const arrowSort = document.createElement("style");
    arrowSort.className = "arrow-sort-" + w.general.renderTo;
    arrowSort.innerText =
      '.arrow-up::before {content: "\\2191";font-weight: bold;font-size: 21px;} .arrow-down::before {content: "\\2193";font-weight: bold;font-size: 21px;}';
    document.body.appendChild(arrowSort);

    // нахождение столбцов по классу для добавление кнопки сортировки
    const columsSpan = widget.find(".dx-pivotgrid-horizontal-headers tr").eq(1).find("td");
    const colums = widget.find(".dx-pivotgrid-horizontal-headers tr").eq(1).find("td");
    let columnsValId = 0;

    // создание и добавление элементов в каждый столбец
    for (let i = 0; i < columsSpan.length; i++) {
      const span = document.createElement("span");
      columnsValId = columnsValId > columsSpan.length ? 0 : columnsValId;
      span.id = "fa-sort-" + w.general.renderTo;
      span.className = "fa-sort";
      span.setAttribute("data-columnsVal", columnsValId++);
      span.style.cssText =
        "\n        font: normal normal normal 16px/1 FontAwesome;\n        cursor: pointer;\n        position: absolute;\n        top: 10px;\n        right: 10px;\n    ";

      columsSpan[i].appendChild(span);
      columsSpan[i].style.cssText =
        " \n        display: flex;\n        justify-content: left;\n        gap: 10px;\n        margin: 0;\n        max-width: 189px;\n    ";

      colums[i].style.cssText =
        '\n    position: relative;\n    border-bottom-width: 0px;\n    font-family: "Roboto";\n    font-weight: ;\n    font-size: 18px;\n    color: rgb(51, 64, 89);\n    background-color: rgba(240, 243, 255, 1);\n    vertical-align: top;\n    text-align: left;\n    width: 20%;\n    ';
    }

    // Вызов функции сортировки по клику. Сортировка меняется от меньшего к большему и наоборот
    widget.find(".fa-sort").on("click", (e) => {
      columnSort = e.target.dataset.columnsval;
      tableBasicChart.sort(columnSort, 0);

      // вызов функции отрисовки кнопок т.к после сортировки заново происходит рендер виджета
      tableBasicChart.hideTableOnLoad();
      tableBasicChart.customizingStyles();
    });
  },
  removeItems() {
    wigetId.find("#" + exportButtonId).remove();
    wigetId.find(".table-zoom-" + w.general.renderTo).remove();
    wigetId.find('[data-type="error-message"]')?.remove();
  },
  hideSpiner() {
    if (!w.pivotGridOptions.dataSource.isLoading()) {
      wigetId.find(".va-widget-loader").css({
        display: "none",
      });
      wigetId.find("#pivotGridContainer_" + w.general.renderTo + " table").css({
        opacity: "1",
      });
    } else {
      setTimeout(tableBasicChart.hideSpiner, 50);
    }
  },
  removeStyles() {
    $(".row-headers-width-" + w.general.renderTo).remove();
    $(".body-table-" + w.general.renderTo).remove();
    $(".header-table-" + w.general.renderTo).remove();
    $(".cell-hight-" + w.general.renderTo).remove();
  },
  hideTableOnLoad() {
    wigetId.find("#pivotGridContainer_" + w.general.renderTo + " table").css({
      opacity: "0",
    });
    wigetId.find(".dx-loadpanel").css({
      display: "none",
    });
    wigetId.find(".va-widget-loader").css({
      display: "block",
    });
  },
  changeValueToDate(rowData) {
    for (let i = 0; i < rowData.children.length; i++) {
      const value = tableBasicChart.getValue(rowData.children[i]);
      if (value) {
        let parts = value.split("-");
        const formattedDate = `${parts[2]}.${parts[1]}.${parts[0]}`;
        tableBasicChart.setValue(rowData.children[i], formattedDate);
      }
      if (rowData.children[i].children && rowData.children[i].children.length > 0) {
        tableBasicChart.changeValueToDate(rowData.children[i]);
      }
    }
  },
  getValue(node) {
    if (node.children && node.children.length > 0) {
      return tableBasicChart.getValue(node.children[0]);
    } else {
      return node.value;
    }
  },
  setValue(node, value) {
    if (node.children && node.children.length > 0) {
      tableBasicChart.setValue(node.children[0], value);
    } else {
      node.value = value.replace(/undefined\./g, "");
    }
  },
  showMessage() {
    const error = document.createElement("div");
    error.setAttribute("data-type", "error-message");
    error.innerText = "Нет данных, удовлетворяющих условиям фильтрации";
    error.style.cssText = `
        position: absolute;
        top: 50%; 
        width: 100%; 
        color: #828282; 
        font-size: 25px;
        font-family: 'Roboto';
        text-align: center;
        transform: translateY(-50%);
        -webkit-transform: translateY(-50%)
     `;
    document.getElementById(w.general.renderTo).append(error);

    const element = document.getElementById("va-widget-error-" + w.general.renderTo);
    if (element) {
      element.style.display = "none";
    }
    wigetId.find(".dx-bottom-row").css({
      display: "none",
    });
    wigetId.find(".va-widget-loader").css({
      opacity: 0,
    });
    tableBasicChart.zoomForError();
  },
  customizingStyles(shouldChangeWidth, enableMeasurement = true) {
    removeStyles();
    wigetId.find("td.dx-area-description-cell.dx-pivotgrid-background").css({
      width: lineHeaderWidth + "%",
    });

    w.pivotGridOptions.dataSource.reload().then(() => {
      setTimeout(() => {
        wigetId.find(".dx-area-data-cell table").css({
          "table-layout": "auto",
        });
        wigetId.find(".dx-pivotgrid-horizontal-headers table").css({
          "table-layout": "auto",
        });
        wigetId.find(".dx-area-row-cell table").css({
          "table-layout": "auto",
        });
        wigetId.find(".dx-pivotgrid-horizontal-headers").css({
          width: "100%",
        });
        wigetId.find(".dx-pivotgrid-horizontal-headers table").css({
          width: "100%",
        });
        wigetId.find(".dx-pivotgrid-area-data").css({
          width: "100%",
        });
        wigetId.find(".dx-pivotgrid-area-data table").css({
          width: "100%",
        });
        addSortArrow();
        toogleClassArrowSort(columnSort);
        if (!enableMeasurement) {
          measurementColumnWidth();
        }
        if (shouldChangeWidth) {
          changeWidth();
        }
        hideSpiner();
      }, 100);
    });
  },
  measurementColumnWidth() {
    const tableСolumns = $(".dx-area-data-cell .dx-scrollable-content table tr td");
    const tableRowsLength = $("td", $(".dx-area-data-cell tr")[0]).length - 1;
    const allHeaderСolumns = $(".dx-pivotgrid-horizontal-headers tr").eq(1);
    const headerСolumns = allHeaderСolumns.find("td");

    // настройка ячеек
    for (let i = 0; i <= tableRowsLength; i++) {
      headerСolumns[i].style.width = widthColumn[i] + "%";
      tableСolumns[i].style.width = widthColumn[i] + "%";
      for (let j = i; j <= tableСolumns.length - 1; j = j + tableRowsLength + 1) {
        tableСolumns[j].style.textAlign = textAlign[i];
      }
    }
  },
  changeWidth() {
    const elem = document.querySelectorAll(".dx-scrollable-content table")[1];
    setTimeout(() => {
      document.querySelector(".dx-area-description-cell").style.width = "45%";
      elem.style.tableLayout = "fixed";
      elem.style.width = "100%";
    }, 0);
  },
  _findNodesWithMultipleChildren(obj) {
    let results;

    function traverse(node) {
      if (node.children && Array.isArray(node.children) && node.children.length > 1) {
        results = node;
      }

      if (node.children && Array.isArray(node.children)) {
        node.children.forEach((child) => traverse(child));
      }
    }

    traverse(obj);

    return results;
  },
  _findDeepIndex(node) {
    return node.children && node.children.length > 0 ? tableBasicChart._findDeepIndex(node.children[0]) : node.index;
  },
  _bubbleSort(arr, compareFn) {
    let len = arr.length;
    for (let i = 0; i < len - 1; i++) {
      let wasSwap = false;
      for (let j = 0; j < len - 1 - i; j++) {
        if (compareFn(arr[j], arr[j + 1])) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          wasSwap = true;
        }
      }
      if (!wasSwap) break;
    }
  },
  sort(columnsValId, columnsYearId) {
    const data = JSON.parse(JSON.stringify(w.pivotGridOptions.dataSource.getData()));
    let rows = JSON.parse(JSON.stringify(data.rows));
    const sortDirection = data.sort === "max" ? -1 : 1;
    const compareFn = (a, b) => {
      const deepIndex1 = tableBasicChart._findDeepIndex(a);
      const deepIndex2 = tableBasicChart._findDeepIndex(b);
      return (
        sortDirection * data.values[deepIndex1][columnsYearId][columnsValId] >
        sortDirection * data.values[deepIndex2][columnsYearId][columnsValId]
      );
    };

    for (let i = 0; i < rows.length; i++) {
      if (tableBasicChart._findNodesWithMultipleChildren(rows[i])) {
        tableBasicChart._bubbleSort(tableBasicChart._findNodesWithMultipleChildren(rows[i]).children, compareFn);
      }
    }

    tableBasicChart._bubbleSort(rows, compareFn);

    data.sort = data.sort === "max" ? "min" : "max";
    data.rows = rows;
    w.pivotGridOptions.dataSource._data = data;
  },
  toogleClassArrowSort(columnsValId) {
    if (columnsValId === null) {
      return;
    }
    const data = w.pivotGridOptions.dataSource.getData();
    const arrowSort = data.sort === "max" ? "arrow-up" : "arrow-down";
    $(widget.find(".fa-sort")[columnsValId]).removeClass("fa-sort").addClass(arrowSort);
  },
  checkValues(values) {
    const result = [];
    for (let i = 0; i < values.length; i++) {
      const current = values[i][0];
      if ((current[0] === "" || current[0] === 0) && (current[1] === "" || current[1] === 0)) {
        result.push(true);
      } else {
        result.push(false);
      }
    }
    return result.length > 0 && result.every((i) => i === true);
  },
};
