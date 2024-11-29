
/**
 * @description Этот файл переобределяет функций для работы с фильтром двухуровневой вложенности.
 * Включает в себя:
 * - Управление выбранными регионами (`getAllSelectRegions`).
 * - Обновление отображаемого текста фильтра в зависимости от выбора (`addTextInput`).
 * - Добавление выбранных значений в интерфейс фильтра (`addSelectedValues`).
 *
 */

function getAllSelectRegions() {
  const regions = [];
  for (let i = 0; i < twoLevelFilter.dataSource.length; i++) {
    for (let j = 0; j < twoLevelFilter.dataSource[i].items.length; j++) {
      if (twoLevelFilter.dataSource[i].items[j].selected) {
        regions.push(twoLevelFilter.dataSource[i].items[j].id);
      }
    }
  }
  return regions;
}

twoLevelFilter.getAllSelectRegions = getAllSelectRegions

function addTextInput(selectedRegions) {
  const headerText = $('#filter-' + w.general.renderTo).find('.rb-filter-header-text');
  const headerArrow = widgetId.find('.filter-arrow');
  const headerClose = widgetId.find('.filter-close');
  if (selectedRegions.length === 0) {
    headerText[0].innerText = 'Все';
    headerClose.hide();
    headerArrow.css({
      display: 'block',
    });
  } else {
    const isTheSame = selectedRegions.every(i => i[0] === selectedRegions[0][0]) && twoLevelFilter.dataSource.find(i => i.text === selectedRegions[0][0]).items.length === selectedRegions.length;
    if (selectedRegions.length === 1 && !isTheSame) {
    headerText[0].innerText = selectedRegions[0][1].split(' - ').length === 2 ? selectedRegions[0][1].split(' - ')[0] : selectedRegions[0][1];
    headerArrow.hide();
    headerClose.css({
      display: 'block',
    });
   }else if (isTheSame) {
      headerText[0].innerText = selectedRegions[0][0];
    } else{
      headerText[0].innerText = 'Выбрано: ' + selectedRegions.length;
    }  
    headerArrow.hide();
    headerClose.css({
      display: 'block',
    });
 }
}

twoLevelFilter.addTextInput = addTextInput;

function addSelectedValues(values) {
  widgetId.find(".rb-filter-cloud-tag-list li").remove();
  if (values === null) {
    return;
  }

  const selectedValues = twoLevelFilter.getSelectValues();
  
  const uniqueItems = [];
  const uniqueValues = [...new Set(selectedValues.map((item) => item[0]))];

  uniqueValues.forEach((i) => {
    const filteredItems = selectedValues.filter((item) => item[0] === i);
    if (
      twoLevelFilter.dataSource.find((item) => item.text === i).items.length ===
      filteredItems.length
    ) {
      uniqueItems.push([i, i]);
    } else {
      uniqueItems.push(...filteredItems);
    }
  });

  for (let i = 0; i < uniqueItems.length; i++) {
      let item = uniqueItems[i][uniqueItems[i].length - 1];
      let text = item.split(' - ').length === 2 ? item.split(' - ')[0] : item;
     const value =
      '<li><div title=""><span class="rb-tag-title">' +
      text +
      '</span><i class="fa fa-times-circle rb-filter-tag-close-button"></i></div></li>';
    widgetId.find(".rb-filter-cloud-tag-list").append(value);
  }

  // удаление элемента
  widgetId.find(".rb-filter-tag-close-button").click(function () {
    twoLevelFilter.deleteSelectedValues(this);
  });
}

twoLevelFilter.addSelectedValues = addSelectedValues;



// Скрытие чекбоксов после клика в другую область
$(document).mouseup((e) => {
  if (widgetId.has(e.target).length === 0) {
    widgetId.find('.va-widget-body-container').hide();
  }
});

twoLevelFilter.renderFilter();