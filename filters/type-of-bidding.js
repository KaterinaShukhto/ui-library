/**
 * Этот файл реализует логику создания и отображения двухуровневого фильтра с поддержкой всплывающих подсказок.
 * 
 * Основные функции и блоки:
 * 
 * 1. **Функция `createList`**:
 *    - Создает иерархический список, включающий элементы, их подсписки и всплывающие подсказки.
 * 
 * 2. **Добавление стилей для подсказок и отображения подсказок**:
 *    - Создается и добавляется элемент `<style>` с правилами для класса `.custom-tooltip`.
 *    - Стили определяют внешний вид и позиционирование подсказок.
 *    - Наведение на элемент списка инициирует создание подсказки.
 * 
 */


function createList(listData, chainMeasure) {
  return Array.from(new Set(listData.map((item) => item[0]))).map((item) => {
    let currentId = chainMeasure.concat(item);
    let subList = listData.filter((itemFilter) => item === itemFilter[0]).map((itemMap) => itemMap.slice(1));

    let items = subList[0] && subList[0][1] ? subList : undefined;

    let thirdLevelItems =
      subList.length > 0 && subList[0].length > 0
        ? Array.from(new Set(subList.map((subItem) => subItem[0]))).join(", ")
        : null;

    return {
      text: item.split(" - ").length === 2 ? item.split(" - ")[0] : item,
      expanded: false,
      id: currentId,
      items: chainMeasure.length === 0 && items ? createList(subList, currentId) : null,
      tooltip: chainMeasure.length === 1 && thirdLevelItems ? `${thirdLevelItems}` : null,
      selected: twoLevelFilter.selectedValues.some((someItem) => someItem == currentId.join()),
    };
  });
}

twoLevelFilter.createList = createList;

setTimeout(() => {
  const tooltipStyle = document.createElement("style");

  tooltipStyle.className = `tooltip-style-${w.general.renderTo}`;

  tooltipStyle.innerText = `
    .custom-tooltip {
      display: none;
      position: absolute;
      background-color: #f9f9f6;
      color: #333;
      padding: 5px;
      border: 1px solid #DBD7D2;
      border-radius: 3px;
      z-index: 1000;
      font-size: 12px;
      font-family: Roboto, sans-serif;
      max-width: 600px;
      word-wrap: break-word;
      white-space: normal;
    }
  `;

  document.body.appendChild(tooltipStyle);

  widgetId
    .find(".va-widget-body ul")
    .on("mouseenter", "li", function (event) {
      let ariaLabel = this.closest("ul").parentElement.getAttribute("aria-label");
      if (event.target.closest(".dx-treeview-node-is-leaf") && ariaLabel !== null) {
        const targetText = event.target.textContent;
        const target = twoLevelFilter.dataSource.find((i) => i.text === ariaLabel);
        const tooltipObject = target.items.find((i) => i.text === targetText);
        const tooltipText = tooltipObject?.tooltip;
        console.log("tooltipText", tooltipText);
        const tooltip = $('<div class="custom-tooltip"></div>').text(tooltipText);
        $("body").append(tooltip);

        const offset = $(this).offset();

        tooltip
          .css({
            top: offset.top + $(this).outerHeight(),
            left: offset.left,
          })
          .fadeIn(200);
      }
    })
    .on("mouseleave", "li", function () {
      $(".custom-tooltip").fadeOut(100, function () {
        $(this).remove();
      });
    });
}, 1500);

$(document).mouseup((e) => {
  if (widgetId.has(e.target).length === 0) {
    widgetId.find(".va-widget-body-container").hide();
  }
});

twoLevelFilter.renderFilter();
