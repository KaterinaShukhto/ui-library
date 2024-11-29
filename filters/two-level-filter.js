const twoLevelFilter = {
    createList: function (listData, chainMeasure) {
      return Array.from(new Set(listData.map((item) => item[0]))).map((item) => {
        let currentId = chainMeasure.concat(item); 
        let items =
          listData[0] && listData[0][1]
            ? createList(
                listData 
                  .filter((itemFilter) => item == itemFilter[0]) 
                  .map((itemMap) => itemMap.slice(1)),
                currentId
              )
            : undefined;
        return {
          text: item.split(' - ').length === 2 ? item.split(' - ')[0].trim() : item,
          expanded: false,
          id: chainMeasure.concat(item),
          items:
            listData[0] && listData[0][1]
              ? twoLevelFilter.createList(
                  listData.filter((itemFilter) => item === itemFilter[0]).map((itemMap) => itemMap.slice(1)),
                  chainMeasure.concat(item)
                )
              : null,
          selected: twoLevelFilter.selectedValues.some((someItem) => someItem == currentId.join()),
        };
      });
    },
    addSelectedValues: function (values) {
      const tagList = widgetId.find(".rb-filter-cloud-tag-list");
      tagList.empty(); // Очистка списка
  
      if (!values) return;
  
      const selectedValues = twoLevelFilter.getSelectValues();
      const uniqueItems = new Map();
  
      selectedValues.forEach(([key, value]) => {
        const dataSourceItem = twoLevelFilter.dataSource.find((item) => item.text === key);
        const existingItem = uniqueItems.get(key) || [];
  
        if (dataSourceItem.items.length === existingItem.length + 1) {
          uniqueItems.set(key, [[key, key]]);
        } else {
          existingItem.push([key, value]);
          uniqueItems.set(key, existingItem);
        }
      });
  
      uniqueItems.forEach((items) => {
        items.forEach(([, value]) => {
          const tag = `<li><div title=""><span class="rb-tag-title">${value}</span><i class="fa fa-times-circle rb-filter-tag-close-button"></i></div></li>`;
          tagList.append(tag);
        });
      });
  
      // Обработчик удаления элементов
      tagList.find(".rb-filter-tag-close-button").click(function () {
        twoLevelFilter.deleteSelectedValues(this);
      });
    },
    renderFilter: function () {
      twoLevelFilter.selectedValues = visApi()
        .getSelectedValues(w.general.renderTo)
        .map((item) => item.join());
  
      twoLevelFilter.dataSource = twoLevelFilter.createList(w.data.rows, []);
      // Построение виджета
      twoLevelFilter.dxTreeView = new DevExpress.ui.dxTreeView(document.getElementById(w.general.renderTo), {
        dataSource: twoLevelFilter.dataSource,
        searchEnabled: true,
        searchTimeout: 700,
        showCheckBoxesMode: "normal",
        selectByClick: true,
        selectNodesRecursive: true,
        onSelectionChanged(e) {
          twoLevelFilter.addSelectedValues(e.component);
        },
      });
  
      visApi().onWidgetLoadedListener({ guid: w.general.renderTo, widgetGuid: w.general.renderTo }, function () {
        const values = twoLevelFilter.getSelectValues();
        twoLevelFilter.filterInit({ values: values });
        twoLevelFilter.syncSelection();
      });
    },
    getSelectValues: function () {
      let regions = [];
      function recur(items) {
        items.forEach((i) => {
          if (i.selected === true && !i.expanded && Array.isArray(i.items)) recur(i.items);
  
          if ((i.expanded === true || i.selected === undefined) && Array.isArray(i.items)) recur(i.items);
          if (i.selected === true && !Array.isArray(i.items)) regions.push(i.id);
        });
      }
      recur(twoLevelFilter.dataSource);
      return regions;
    },
    deleteSelectedValues: function (elem) {
      const itemDOM = $(elem).closest("div");
      const itemText = itemDOM.text();
      itemDOM.closest("li").remove();
      for (let i = 0; i < twoLevelFilter.dataSource.length; i++) {
        if (twoLevelFilter.dataSource[i].text === itemText) {
          twoLevelFilter.dataSource[i].selected = false;
          twoLevelFilter.dxTreeView.unselectItem(twoLevelFilter.dataSource[i]);
          for (let j = 0; j < twoLevelFilter.dataSource[i].items.length; j++) {
            twoLevelFilter.dataSource[i].items[j].selected = false;
            twoLevelFilter.dxTreeView.unselectItem(twoLevelFilter.dataSource[i].items[j]);
          }
          return;
        }
        for (let j = 0; j < twoLevelFilter.dataSource[i].items.length; j++) {
          if (twoLevelFilter.dataSource[i].items[j].text === itemText) {
            twoLevelFilter.dataSource[i].items[j].selected = false;
            twoLevelFilter.dxTreeView.unselectItem(twoLevelFilter.dataSource[i].items[j]);
            return;
          }
        }
      }
    },
    filterInit: function (filter) {
      twoLevelFilter.removeInitialList();
      twoLevelFilter.createElements();
  
      if (filter !== null && filter.length !== 0) {
        if (filter.values.length !== 0) {
          for (let i = 0; i < filter.subjectRF.length; i++) {
            if (filter.subjectRF[i].length === 1) {
              for (let j = 0; j < dataSource.length; j++) {
                if (dataSource[j].text === filter.subjectRF[i][0]) {
                  dxTreeView.selectItem(dataSource[j]);
                }
              }
            } else if (filter.subjectRF[i].length === 2) {
              for (let j = 0; j < dataSource.length; j++) {
                for (let k = 0; k < dataSource[j].items.length; k++) {
                  let text = filter.subjectRF[i][1].split(' - ').length === 2 ? filter.subjectRF[i][1].split(' - ')[0] : filter.subjectRF[i][1];
                  if (dataSource[j].items[k].text === text && dataSource[j].text === filter.subjectRF[i][0]) {
                    dxTreeView.selectItem(dataSource[j].items[k]);
                  }
                }
              }
            } 
          }
          const selectedValues = twoLevelFilter.getSelectValues();
          visApi().setFilterSelectedValues(w.general.renderTo, selectedValues);
          twoLevelFilter.addTextInput(filter.values);
          twoLevelFilter.addSelectedValues(filter.values);
        }
      }
    },
    syncSelection: function (check) {
      let regions = [];
  
      if (check === null) {
        regions = [];
        twoLevelFilter.dxTreeView.collapseAll();
        twoLevelFilter.dxTreeView.unselectAll();
      } else {
        let allRegions = w.data.rows;
        regions = twoLevelFilter.getSelectValues();
        if (!isCheckedInclude) {
          const allSelectRegions = twoLevelFilter.getAllSelectRegions();
          if (allSelectRegions.length === 85) {
            visApi().setExcludeFilterSelectedValues(w.general.renderTo, regions);
            twoLevelFilter.addTextInput(regions);
            return;
          }
          for (let i = 0; i < regions.length; i++) {
            allRegions = twoLevelFilter.regionFilter(allRegions, regions, i);
          }
          regions = allRegions;
        }
      }
  
      visApi().setFilterSelectedValues(w.general.renderTo, regions);
      twoLevelFilter.addTextInput(twoLevelFilter.getSelectValues());
    },
    removeInitialList: function () {
      widget.css({
        opacity: "0%",
      });
  
      setTimeout(() => {
        widget.css({
          opacity: "100%",
        });
      }, 1000);
    },
    createElements: function () {
      const headerContainer = widgetId.find(".va-widget-header-container");
      const treeviewSearch = widget.find(".dx-treeview-search");
      headerContainer.css({ "background-color": "transparent" });
  
      twoLevelFilter.removeItems();
  
      const search = document.createElement("div");
      search.className = "filter-wrapper-new" + w.general.renderTo;
      search.innerHTML =
        '<div class="va-widget-body" id=' +
        "filter-" +
        w.general.renderTo +
        ' style="background-color: transparent; border-radius: 0px; overflow: visible;"><div class="rb-filter-container not-selectable" style="color: rgba(51,64,89,1);font-size: 20px;font-style: normal;font-weight: normal;font-family: Roboto;"><div class="rb-filter-header-container"><div class="rb-filter-header-text">Все</div><i class="fa fa-caret-down rb-filter-header-arrow subject filter-arrow"></i><i class="fa fa-times rb-filter-header-close filter-close" title="Очистить все выбранные значения" style="display: none;"></i></div>';
  
      const actionsButtons = document.createElement("div");
      actionsButtons.className = "rb-actions-buttons-container";
      actionsButtons.innerHTML =
        '<div class="rb-filter-cancel-button button">Отмена</div><div class="rb-filter-apply-button button">Применить</div>';
  
      const filterTag = document.createElement("div");
      filterTag.className = "rb-filter-cloud-tag-container";
      filterTag.innerHTML =
        '<span>Выбранные значения <i class="fa fa-angle-down"></i></span><ol class="rb-filter-cloud-tag-list" style="display: none;"></ol>';
  
      const selectionButtons = document.createElement("div");
      selectionButtons.className = "filter-selection-buttons";
      selectionButtons.innerHTML =
        '<div class="filter-select-all-button button">Выбрать все</div><div class="filter-unselect-all-button button">Сбросить все</div>';
  
      const filterExclude = document.createElement("div");
      filterExclude.className = "rb-filter-exclude-container";
      filterExclude.innerHTML =
        '<input class="magic-radio magic" id=' +
        w.general.renderTo +
        "-rb-filter-include-checkbox" +
        ' type="radio" value="include" checked="true"><label for=' +
        w.general.renderTo +
        "-rb-filter-include-checkbox" +
        '>Включить</label><input class="magic-radio magic" id=' +
        w.general.renderTo +
        "-rb-filter-exclude-checkbox" +
        ' type="radio" value="exclude"><label for=' +
        w.general.renderTo +
        "-rb-filter-exclude-checkbox" +
        ">Исключить</label>";
  
      headerContainer.after(search);
      widget.before(filterTag);
      treeviewSearch.after(selectionButtons);
      treeviewSearch.after(filterExclude);
      widget.after(actionsButtons);
  
      widgetId.find(".dx-texteditor-input")[0].setAttribute("placeholder", "Поиск...");
  
      // Отображение чекбоксов для выбора субъектов
      $(".filter-wrapper-new" + w.general.renderTo).click((e) => {
        const resetСheck = e.target.classList.contains("filter-close");
  
        if (resetСheck) {
          widgetId.find(".va-widget-body-container").slideUp(200);
        } else {
          widgetId.find(".va-widget-body-container").slideToggle(200);
          var treeView = $("#" + w.general.renderTo).dxTreeView("instance");
          var allNodes = treeView.getNodes();
          var unselectedNodes = allNodes.filter((node) => !node.selected);
          unselectedNodes.forEach((node) => {
            if (node.items.every((i) => i.selected === false)) {
              $("#" + w.general.renderTo).dxTreeView("collapseItem", node.key);
            } else {
              node.items.forEach((item) => {
                if (item.selected === false) {
                  $("#" + w.general.renderTo).dxTreeView("collapseItem", item.key);
                }
              });
            }
          });
        }
  
        if ($(".opened").length) {
          $(".opened").hide();
          $(".opened")[0].classList.remove("opened");
        }
  
        $(".rb-actions-buttons-container").css({
          display: "flex",
        });
      });
  
      // сброс фильтра
      widgetId.find(".filter-close").click(() => {
        widgetId.find(".dx-icon-clear").click();
        twoLevelFilter.syncSelection(null);
        twoLevelFilter.addSelectedValues(null);
      });
  
      widgetId.find(".filter-select-all-button").click(() => {
        twoLevelFilter.dxTreeView.selectAll();
      });
  
      widgetId.find(".filter-unselect-all-button").click(() => {
        twoLevelFilter.dxTreeView.collapseAll();
        twoLevelFilter.dxTreeView.unselectAll();
      });
  
      widgetId.find(".rb-filter-cancel-button").click(() => {
        let filter = {};
        filter.values = visApi().getSelectedValues(w.general.renderTo);
        widgetId.find(".va-widget-body-container").slideUp(200);
        twoLevelFilter.dxTreeView.collapseAll();
        twoLevelFilter.dxTreeView.unselectAll();
        twoLevelFilter.filterInit(filter);
      });
  
      widgetId.find(".rb-filter-apply-button").click(() => {
        widgetId.find(".va-widget-body-container").slideUp(200);
        twoLevelFilter.syncSelection();
      });
  
      widgetId.find(".rb-filter-cloud-tag-container span").click(() => {
        widgetId.find(".rb-filter-cloud-tag-list").slideToggle(200);
      });
  
      widgetId.find("label").click(() => {
        $("#" + w.general.renderTo + "-rb-filter-include-checkbox")[0].checked = !$(
          "#" + w.general.renderTo + "-rb-filter-include-checkbox"
        )[0].checked;
        $("#" + w.general.renderTo + "-rb-filter-exclude-checkbox")[0].checked = !$(
          "#" + w.general.renderTo + "-rb-filter-exclude-checkbox"
        )[0].checked;
        isCheckedInclude = $("#" + w.general.renderTo + "-rb-filter-include-checkbox")[0].checked;
      });
  
      widgetId.find(".dx-texteditor-input").on("keyup", function () {
        if (!widgetId.find(".dx-texteditor-input").val()) {
          twoLevelFilter.dxTreeView.collapseAll();
        }
      });
  
      widgetId.find(".rb-filter-container ").on("click", function () {
        if (
          widgetId.find(".dx-texteditor-input").val() &&
          widgetId.find(".va-widget-body-container")[0].style.display === "none"
        ) {
          setTimeout(() => {
            twoLevelFilter.dxTreeView.expandAll();
            twoLevelFilter.createButtons();
            widgetId.find(".dx-icon.dx-icon-search").css({
              opacity: "0",
              display: "none",
            });
            widgetId.find(".dx-texteditor-input").css("padding-left", "10px");
            widgetId.find(".dx-texteditor-input").css({ "font-size": "18px" });
            widgetId.find(".dx-texteditor-input").on("keyup", function () {
              if (!widgetId.find(".dx-texteditor-input").val()) {
                twoLevelFilter.dxTreeView.collapseAll();
              }
            });
          }, 0);
        }
      });
  
      twoLevelFilter.applyCssStyle();
    },
    removeItems: function () {
      $(".checkbox-container-" + w.general.renderTo).remove();
      $(".checkbox-state-focused-" + w.general.renderTo).remove();
      $(".checkbox-state-hover-" + w.general.renderTo).remove();
      $(".checkbox-icon-before-" + w.general.renderTo).remove();
      $(".checkbox-checked-" + w.general.renderTo).remove();
      $(".style-widget-height-" + w.general.renderTo).remove();
      $(".style-magic-label-" + w.general.renderTo).remove();
      $(".filter-wrapper-new" + w.general.renderTo).remove();
      widgetId.find(".rb-actions-buttons-container").remove();
      widgetId.find(".rb-filter-cloud-tag-container").remove();
      widgetId.find(".rb-filter-exclude-container").remove();
      widgetId.find(".filter-selection-buttons").remove();
      widgetId.find(".dx-placeholder").remove();
      widgetId.find(".dx-icon-search").remove();
    },
    createButtons: function () {
      const treeviewSearch = widget.find(".dx-treeview-search");
      const selectionButtons = document.createElement("div");
      selectionButtons.className = "filter-selection-buttons";
      selectionButtons.innerHTML = `<div 
          class="filter-select-all-button button"
          style="
            padding: 10px;
            cursor: pointer;
            text-transform: uppercase;
            color: rgb(62, 163, 245);
            font-size: 13px;
            font-style: normal;
            font-weight: normal;
            font-family: Roboto;"
          >Выбрать все</div>
          <div 
          class="filter-unselect-all-button button"
          style="
            padding: 10px;
            cursor: pointer;
            text-transform: uppercase;
            color: rgb(62, 163, 245);
            font-size: 13px;
            font-style: normal;
            font-weight: normal;
            font-family: Roboto;"
          >Сбросить все</div>`;
      treeviewSearch.after(selectionButtons);
      widgetId.find(".filter-select-all-button").click(() => {
        twoLevelFilter.dxTreeView.selectAll();
      });
  
      widgetId.find(".filter-unselect-all-button").click(() => {
        twoLevelFilter.dxTreeView.collapseAll();
        twoLevelFilter.dxTreeView.unselectAll();
      });
  
      widgetId.find(".filter-selection-buttons").css({
        display: "flex",
        "font-size": "20px",
      });
      widgetId.find(".dx-scrollable.dx-visibility-change-handler").css({
        "border-top": "1px solid rgb(237, 237, 237)",
        " border-bottom": "1px solid rgb(237, 237, 237)",
        height: "300px",
      });
    },
    applyCssStyle: function () {
      widget.css({
        background: "white",
        display: "block",
      });
  
      widgetId.css({
        "z-index": "1001",
      });
  
      widgetId.find(".rb-filter-cloud-tag-container").css({
        "font-family": "Roboto",
        margin: "0 0 5px 0",
        "font-size": "14px",
      });
  
      widgetId.find(".filter-selection-buttons").css({
        display: "flex",
        "font-size": "20px",
      });
  
      widgetId.find(".rb-filter-exclude-container").css({
        display: "none",
      });
  
      widgetId.find(".va-widget-body-container").css({
        display: "none",
        width: width ? width + "px" : "",
        "min-width": "310px",
        overflow: "hidden",
        border: "1px solid #ededed",
        "margin-top": "0px",
        padding: "10px",
        "background-color": "white",
        cursor: "default",
        height: "auto",
        "max-height": "800px",
        [listPosition]: 0,
      });
  
      widgetId.find(".button").css({
        padding: "10px",
        cursor: "pointer",
        "text-transform": "uppercase",
        color: "#3ea3f5",
        "font-size": "13px",
        "font-style": "normal",
        "font-weight": "normal",
        "font-family": "Roboto",
      });
  
      widgetId.find(".button").hover(
        () => {
          $(this).css("opacity", "0.7");
        },
        () => {
          $(this).css("opacity", "1");
        }
      );
  
      widgetId.find(".rb-filter-apply-button").css({
        color: "white",
        "background-color": "#3ea3f5",
      });
  
      widgetId.find(".dx-visibility-change-handler").css({
        "border-top": "1px solid #ededed",
        "border-bottom": "1px solid #ededed",
        height: twoLevelFilter.calculateHeight(height),
      });
  
      widgetId.find(".dx-scrollable-content").css({
        height: "100%",
        overflow: "hidden",
      });
  
      widgetId.find(".dx-treeview-node-container").css({
        height: "100%",
        margin: "0",
        padding: "0",
        "list-style": "none",
        overflow: "auto",
        "font-size": "18px",
      });
  
      widgetId.find(".dx-texteditor-input").css({
        padding: "5px 10px",
      });
  
      // изменить стрелку выпадающего меню
      $(".rb-filter-header-arrow").css({
        color: "#0033FF",
      });
      $(".rb-filter-header-close").css({
        color: "#0033FF",
      });
  
      widgetId.find(".dx-texteditor-input")[0].classList.add("rb-filter-search");
      widgetId.addClass("widgetHeight");
  
      const styleMagicLabel = document.createElement("style");
      styleMagicLabel.className = "style-magic-label-" + w.general.renderTo;
      const styleWidgetHeight = document.createElement("style");
      styleWidgetHeight.className = "style-widget-height-" + w.general.renderTo;
      styleMagicLabel.innerText = ".magic + label:after{top: 5px;left: 5px;}";
      styleWidgetHeight.innerText = ".widgetHeight {display: table-caption;}";
      document.body.appendChild(styleMagicLabel);
      document.body.appendChild(styleWidgetHeight);
  
      const checkboxStateFocused = document.createElement("style");
      checkboxStateFocused.className = "checkbox-state-focused-" + w.general.renderTo;
      checkboxStateFocused.innerText =
        ".dx-treeview-item-with-checkbox.dx-state-focused > .dx-checkbox .dx-checkbox-icon {border: 2px solid #47c148;}";
      document.body.appendChild(checkboxStateFocused);
  
      const checkboxStateHover = document.createElement("style");
      checkboxStateHover.className = "checkbox-state-hover-" + w.general.renderTo;
      checkboxStateHover.innerText = ".dx-checkbox.dx-state-hover .dx-checkbox-icon {border: 2px solid #47c148;}";
      document.body.appendChild(checkboxStateHover);
  
      const checkboxIconBefore = document.createElement("style");
      checkboxIconBefore.className = "checkbox-icon-before-" + w.general.renderTo;
      checkboxIconBefore.innerText = ".dx-checkbox-indeterminate .dx-checkbox-icon::before {background-color: #47c148;}";
      document.body.appendChild(checkboxIconBefore);
  
      const checkboxChecked = document.createElement("style");
      checkboxChecked.className = "checkbox-checked-" + w.general.renderTo;
      checkboxChecked.innerText =
        ".dx-checkbox-checked .dx-checkbox-icon::before  {color: white; background-color: #47c148;width: 20px;height: 20px;margin-left: 0;margin-top: 0;top: -2px;left: -2px;padding-top: 2px;} .dx-checkbox-icon{width: 20px; height: 20px; font-size: 14px; font-weight: 900; border: 2px solid #959595;}";
      document.body.appendChild(checkboxChecked);
  
      const checkboxContainer = document.createElement("style");
      checkboxContainer.className = "checkbox-container-" + w.general.renderTo;
      checkboxContainer.innerText =
        ".dx-checkbox-icon {border-radius: 5px;} .dx-checkbox-container{border-radius: 5px;} .dx-checkbox-checked .dx-checkbox-icon {font: bold 15px DXIcons;} .dx-empty-message {position: absolute; top: 30px; left: 50%; transform: translateX(-50%); font-size: 16px; color: #000}";
      document.body.appendChild(checkboxContainer);
  
      // Изменяем цвет контура фильтра, скругление контура фильтра
      widgetId.find(".rb-filter-header-container").css({ border: "1px solid #C4CDD6", "border-radius": "10px" });
  
      // Цвет и шрифт элементов списка
      widgetId.find(".dx-widget").css({ "font-family": "Roboto", color: "#334059", "font-size": "18px" });
      // Шрифт и цвет текста выбранных значений
      widgetId.find(".rb-tag-title").css({ "font-family": "Roboto", color: "#334059 !important" });
      widgetId.find(".dx-treeview-toggle-item-visibility").css({
        top: "3px",
      });
      // сдвигаем чекбоксы
      widgetId.find(".dx-checkbox").css({
        top: "9px",
      });
      // размер шрифта в поле поиска
      widgetId.find(".rb-filter-search").css({ "font-size": "18px", "padding-top": "7px", "padding-bottom": "7px" });
    },
    addTextInput: function (selectedRegions) {
      const headerText = $("#filter-" + w.general.renderTo).find(".rb-filter-header-text");
      const headerArrow = widgetId.find(".filter-arrow");
      const headerClose = widgetId.find(".filter-close");
      const selectedRegionsLength = selectedRegions.length;
      if (selectedRegions.length === 0) {
        headerText[0].innerText = "Все";
        headerClose.hide();
        headerArrow.css({
          display: "block",
        });
      } else if (selectedRegions[0].length === 1 && selectedRegionsLength === 1) {
        headerText[0].innerText = selectedRegions[0][0];
        headerArrow.hide();
        headerClose.css({
          display: "block",
        });
      } else if (selectedRegions[0].length === 2 && selectedRegionsLength === 1) {
        headerText[0].innerText = selectedRegions[0][1];
        headerArrow.hide();
        headerClose.css({
          display: "block",
        });
      } else {
        const isTheSame =
          selectedRegions.every((i) => i[0] === selectedRegions[0][0]) &&
          twoLevelFilter.dataSource.find((i) => i.text === selectedRegions[0][0]).items.length === selectedRegions.length;
        if (isTheSame) {
          headerText[0].innerText = selectedRegions[0][0];
        } else {
          headerText[0].innerText = "Выбрано: " + selectedRegions.length;
        }
        headerArrow.hide();
        headerClose.css({
          display: "block",
        });
      }
    },
    regionFilter: function (allRegions, regions, index) {
      return allRegions.filter((item) =>
        regions[index].length === 1 ? item[0] !== regions[index][0] : item[1] !== regions[index][1]
      );
    },
    getAllSelectRegions: function () {
      const regions = [];
      for (let i = 0; i < twoLevelFilter.dataSource.length; i++) {
        for (let j = 0; j < twoLevelFilter.dataSource[i].items.length; j++) {
          if (twoLevelFilter.dataSource[i].items[j].selected) {
            regions.push(twoLevelFilter.dataSource[i].items[j].id);
          }
        }
      }
      return regions;
    },
    calculateHeight: function (height) {
      if (!height) return "300px";
      if (height < 300) return "300px";
      if (height > 510) return "510px";
      return height + "px";
    },
  };
  
  twoLevelFilter.renderFilter();