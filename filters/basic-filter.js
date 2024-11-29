const basicFilter = {
  widget: $("#" + w.general.renderTo),
  applyCssStyles: function (openToRight = false) {
    $(".checkbox-color").remove();

    // Изменить шрифт вложеных значений
    widget.find(".rb-filter-search").attr("style", "font-size: 18px");
    widget.find(".rb-filter-list-item-text").attr("style", "font-size: 18px");
    widget.find(".rb-filter-exclude-container").attr("style", "font-size: 18px");

    // изменить стрелку выпадающего меню
    widget.find(".rb-filter-header-arrow").css({ color: "#0033FF" });
    // Изменить крестик выпадающего меню
    widget.find(".rb-filter-header-close").css({ color: "#0033FF" });

    widget.find(".rb-filter-header-arrow").css({ color: "#0033FF" });

    // Высота выпадающего списка
    widget.find(".rb-filter-body-container .rb-filter-list-container > ul").css({
      height: "auto",
      "max-height": height ? height + "px" : "500px",
    });
    // Мин Ширина выпадающего списка и ширина выпадающего списка
    const cssStyles = {
      "min-width": "310px",
      width: width ? width + "px" : "310px",
    };

    if (openToRight) {
      cssStyles.left = "-55%";
    }

    widget.find(".rb-filter-body-container").css(cssStyles);

    // Изменяем цвет контура фильтра
    widget.find(".rb-filter-header-container").css({ border: "1px solid #C4CDD6" });
    // Изменяем скругление контура фильтра
    widget.find(".rb-filter-header-container").css({ "border-radius": "10px" });

    // замена цвета чекбоксов на всех фильтрах
    const checkboxChecked = document.createElement("style");
    checkboxChecked.className = "checkbox-color";
    checkboxChecked.innerText = ".rb-filter-body-container ul li i.rb-filter-list-item-icon { color: #959595; }";
    document.body.appendChild(checkboxChecked);
  },

  setupSelectionButtons: function () {
    if (w.data.data.length > 4) {
      $("#widget-" + w.general.renderTo)
        .find(".rb-filter-select-all-button")
        .eq(0)
        .css("margin-right", "25px")
        .text("Выбрать все");
      $("#widget-" + w.general.renderTo)
        .find(".rb-filter-unselect-all-button")
        .eq(0)
        .text("Сбросить все");
      widget.find(".rb-filter-selection-buttons-container").css({
        display: "flex",
        "justify-content": "flex-start",
        "margin-left": "5px",
      });
    } else {
      // скрыть кнопки 'Выбрать отображаемое' и  'снять выделение'
      $("#widget-" + w.general.renderTo)
        .find(".rb-filter-selection-buttons-container")
        .css({ display: "none" });
    }
  },

  observeFilterFieldChanges: function () {
    const observer = new MutationObserver(function (mutations) {
      const value = visApi().getSelectedValues(w.general.renderTo).length;
      if (value > 1) {
        widget.find(".rb-filter-header-text")[0].textContent = "Выбрано: " + value;
      }
    });

    const options = {
      childList: true,
      subtree: true,
    };

    observer.observe(widget.find(".rb-filter-header-text")[0], options);
  },

  initializeFilterSearch: function () {
    let searchString;
    widget.find(".rb-filter-search").on("input", function (e) {
      searchString = e.target.value;
      if (e.target.value.length > 0 && widget.find(".dx-texteditor-buttons-container").length === 0) {
        const element = document.createElement("div");
        element.style.cssText = `
              position: absolute;
              top: 45px;
              right: 0;
            `;
        element.className = "dx-texteditor-buttons-container";
        element.innerHTML =
          '<span class="dx-clear-button-area" style="color: #999; cursor: pointer;"><span class="dx-icon dx-icon-clear" style="font-size: 18px"></span></span>';
        widget.find(".rb-filter-search").after(element);
        $(element).on("click", function () {
          searchString = "";
          widget.find(".rb-filter-search").val("");
          widget.find(".rb-filter-search").trigger("input");
          widget.find(".dx-texteditor-buttons-container").remove();
        });
      } else if (e.target.value.length === 0) {
        widget.find(".dx-texteditor-buttons-container").remove();
      }
    });

    widget
      .find(".rb-filter-search")
      .on("focus", function (e) {
        $(this).css("outline", "none").css("border", "0.6px solid rgba(21, 136, 230, .7)");
      })
      .on("blur", function (e) {
        $(this).css("border", "1px solid #f1f1f1");
      });

    widget.find(".rb-filter-header-close").on("click", function () {
      searchString = "";
      widget.find(".rb-filter-search").val("");
      widget.find(".dx-texteditor-buttons-container").remove();
    });

    widget.find(".rb-filter-cancel-button").on("click", function (e) {
      widget.find(".rb-filter-search").val(searchString);
    });

    visApi().onFilterIsOpenChangedListener(
      { guid: w.general.renderTo, widgetGuid: w.general.renderTo },
      function (data) {
        widget.find(".rb-filter-search").val(searchString);
      }
    );
  },

  initializeYearFromSystem: function () {
    const currentYear = new Date().getFullYear().toString();
    const previousYear = (new Date().getFullYear() - 1).toString();

    visApi().onWidgetLoadedListener(
      { guid: w.general.renderTo + "485515", widgetGuid: w.general.renderTo },
      function () {
        const dateInfo = JSON.parse(localStorage.getItem("dateInfo")) || {};
        const isYearSet = dateInfo[w.general.renderTo];

        if (!isYearSet) {
          const selectedYear = w.data.data.some((i) => i.text === currentYear) ? currentYear : previousYear;
          w.data.selected[0] = { text: selectedYear, id: selectedYear };
          visApi().setFilterSelectedValues(w.general.renderTo, [[selectedYear]]);
          dateInfo[w.general.renderTo] = true;
          localStorage.setItem("dateInfo", JSON.stringify(dateInfo));
        } else {
          const values = visApi().getSelectedValues(w.general.renderTo);
          visApi().setFilterSelectedValues(w.general.renderTo, [[values]]);
        }
      }
    );
  },
};
