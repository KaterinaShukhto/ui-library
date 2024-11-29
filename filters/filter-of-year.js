const filterOfYear = {
  sortItemsByMonth(data) {
    const month = ["янв.", "фев.", "мар.", "апр.", "май", "июн.", "июл.", "авг.", "сен.", "окт.", "ноя.", "дек."];
    data.forEach((year) => {
      year.items.forEach((quarter) => {
        quarter.items.sort((a, b) => {
          const monthA = month.indexOf(a.text.split(" ")[0]);
          const monthB = month.indexOf(b.text.split(" ")[0]);
          return monthA - monthB;
        });
      });
    });
  },
  addTextInput(selectedRegions) {
    const headerText = $("#filter-" + w.general.renderTo).find(".rb-filter-header-text");
    const headerArrow = widgetId.find(".filter-arrow");
    const headerClose = widgetId.find(".filter-close");
    const selectedRegionsLength = selectedRegions.length;
  
    if (selectedRegionsLength === 0) {
      headerText[0].innerText = "Все";
      headerClose.hide();
      headerArrow.css("display", "block");
    } else if (selectedRegionsLength === 1) {
      const filteredRowsBy1 = w.data.rows.filter((i) => i[1] === selectedRegions[0][1]);
      const filteredRowsBy0 = w.data.rows.filter((i) => i[0] === selectedRegions[0][0]);
  
      if (filteredRowsBy1.length === 1 && filteredRowsBy0.length === 1) {
        headerText[0].innerText = selectedRegions[0][0];
      } else if (filteredRowsBy1.length === 1) {
        headerText[0].innerText = selectedRegions[0][1];
      } else {
        headerText[0].innerText = selectedRegions[0][2];
      }
      headerArrow.hide();
      headerClose.css("display", "block");
    } else if (selectedRegionsLength === 3 && selectedRegions.every((i) => i[1] === selectedRegions[0][1])) {
      const filteredRowsBy1 = w.data.rows.filter((i) => i[1] === selectedRegions[0][1]);
  
      if (filteredRowsBy1.length === 3) {
        const filteredRowsBy0 = w.data.rows.filter((i) => i[0] === selectedRegions[0][0]);
  
        if (filteredRowsBy0.length === 3) {
          headerText[0].innerText = selectedRegions[0][0];
        } else {
          headerText[0].innerText = selectedRegions[0][1];
        }
      }
      headerArrow.hide();
      headerClose.css("display", "block");
    } else {
      const firstRegion = selectedRegions[0][0];
      const dataSourceItem = twoLevelFilter.dataSource.find((data) => data.text === firstRegion).items;
      const isTheSame =
        selectedRegions.every((region) => region[0] === firstRegion) &&
        dataSourceItem.reduce((total, item) => total + item.items.length, 0) === selectedRegionsLength;
      const uniqueRegions = [...new Set(selectedRegions.map((region) => region[0]))];
      const isAllSelected = uniqueRegions.every(
        (region) =>
        twoLevelFilter.dataSource.find((data) => data.text === region).items.reduce((total, item) => total + item.items.length, 0) ===
          selectedRegions.filter((n) => n[0] === region).length
      );
  
      if (isTheSame) {
        headerText[0].innerText = firstRegion;
      } else if (isAllSelected) {
        headerText[0].innerText = uniqueRegions.join(", ");
      } else {
        headerText[0].innerText = `Выбрано: ${selectedRegionsLength}`;
      }
  
      headerArrow.hide();
      headerClose.css("display", "block");
    }
  },
  deleteSelectedValues(elem) {
    const itemText = elem.parentElement.textContent;
    const unselect = w.data.rows.find((i) => i.includes(itemText));
    dxTreeView.unselectItem(unselect);
    elem.parentNode.remove();
    for (let i = 0; i < twoLevelFilter.dataSource.length; i++) {
      if (twoLevelFilter.dataSource[i].text === itemText) {
        twoLevelFilter.dataSource[i].selected = false;
        dxTreeView.unselectItem(twoLevelFilter.dataSource[i]);
        for (let j = 0; j < dataSource[i].items.length; j++) {
          twoLevelFilter.dataSource[i].items[j].selected = false;
          dxTreeView.unselectItem(dataSource[i].items[j]);
        }
        return;
      }
      for (let j = 0; j < twoLevelFilter.dataSource[i].items.length; j++) {
        if (twoLevelFilter.dataSource[i].items[j].text === itemText) {
          twoLevelFilter.dataSource[i].items[j].selected = false;
          dxTreeView.unselectItem(twoLevelFilter.dataSource[i].items[j]);
          return;
        }
        for (let n = 0; n < twoLevelFilter.dataSource[i].items[j].items.length; n++) {
          if (twoLevelFilter.dataSource[i].items[j].items[n].text === itemText) {
            twoLevelFilter.dataSource[i].items[j].items[n].selected = false;
            dxTreeView.unselectItem(twoLevelFilter.dataSource[i].items[j].items[n]);
            return;
          }
        }
      }
    }
  },
  
  getSelectedQuarter(selectedValues) {
    const regionCount = selectedValues.reduce((acc, region) => {
      if (acc[region[1]]) {
        acc[region[1]] += 1;
      } else {
        acc[region[1]] = 1;
      }
      return acc;
    }, {});
  
    const isQuarterSelected = Object.keys(regionCount).every(
      (quarter) => w.data.rows.filter((i) => i.includes(quarter)).length === regionCount[quarter]
    );
    if (isQuarterSelected) {
      return Object.keys(regionCount);
    } else {
      const fullSelected = Object.keys(regionCount).filter(
        (quarter) => w.data.rows.filter((i) => i.includes(quarter)).length === regionCount[quarter]
      );
      const other = Object.keys(regionCount)
        .filter((i) => !fullSelected.includes(i))
        .map((i) => selectedValues.filter((n) => n[1] === i).map((n) => n[2]))
        .flat();
      return fullSelected.concat(other);
    }
  },
  addSelectedValues(selectedValues) {
    widgetId.find(".rb-filter-cloud-tag-list li").remove();
    if (selectedValues === null) {
      return;
    }
    let values;
    const allSelectedRegions = getSelectValues();
    const uniqueRegions = [...new Set(allSelectedRegions.map((region) => region[0]))];
    const isAllSelected = uniqueRegions.every(
      (region) =>
        dataSource.find((data) => data.text === region).items.reduce((total, item) => total + item.items.length, 0) ===
        allSelectedRegions.filter((n) => n[0] === region).length
    );
  
    const isSomeSelected = uniqueRegions.some(
      (region) =>
        dataSource.find((data) => data.text === region).items.reduce((total, item) => total + item.items.length, 0) ===
        allSelectedRegions.filter((n) => n[0] === region).length
    );
  
    if (isSomeSelected) {
      const selectedRegion = uniqueRegions.find(
        (region) =>
          dataSource.find((data) => data.text === region).items.reduce((total, item) => total + item.items.length, 0) ===
          allSelectedRegions.filter((n) => n[0] === region).length
      );
      const filterValues = allSelectedRegions.filter((i) => i[0] !== selectedRegion);
      values = [selectedRegion, ...filterOfYear._getSelectedQuarter(filterValues)];
    } else {
      values = filterOfYear._getSelectedQuarter(allSelectedRegions);
    }
  
    if (isAllSelected) {
      values = uniqueRegions;
    }
  
    for (let i = 0; i < values.length; i++) {
      const value =
        '<li><span class="rb-tag-title">' +
        values[i] +
        '</span><i class="fa fa-times-circle rb-filter-tag-close-button"></i></li>';
      widgetId.find(".rb-filter-cloud-tag-list").append(value);
    }
  
    widgetId.find(".rb-filter-tag-close-button").click(function () {
      twoLevelFilter.deleteSelectedValues(this);
    });
  },
  filterInit(filter) {
    twoLevelFilter.removeInitialList();
    twoLevelFilter.createElements();
  
    if (filter !== null && filter.length !== 0) {
      if (filter.subjectRF.length !== 0) {
        for (let i = 0; i < filter.subjectRF.length; i++) {
          if (filter.subjectRF[i].length === 1) {
            for (let j = 0; j < twoLevelFilter.dataSource.length; j++) {
              if (twoLevelFilter.dataSource[j].text === filter.subjectRF[i][0]) {
                dxTreeView.selectItem(twoLevelFilter.dataSource[j]);
              }
            }
          } else if (filter.subjectRF[i].length === 2) {
            for (let j = 0; j < twoLevelFilter.dataSource.length; j++) {
              for (let k = 0; k < twoLevelFilter.dataSource[j].items.length; k++) {
                if (twoLevelFilter.dataSource[j].items[k].text === filter.subjectRF[i][1]) {
                  dxTreeView.selectItem(twoLevelFilter.dataSource[j].items[k]);
                }
              }
            }
          } else {
            for (let j = 0; j < twoLevelFilter.dataSource.length; j++) {
              for (let k = 0; k < twoLevelFilter.dataSource[j].items.length; k++) {
                for (let h = 0; h < twoLevelFilter.dataSource[j].items[k].items.length; h++) {
                  if (twoLevelFilter.dataSource[j].items[k].items[h].text === filter.subjectRF[i][2]) {
                    dxTreeView.selectItem(twoLevelFilter.dataSource[j].items[k].items[h]);
                  }
                }
              }
            }
          }
        }
        const selectedValues = twoLevelFilter.getSelectValues();
        visApi().setFilterSelectedValues(w.general.renderTo, selectedValues);
        filterOfYear.addTextInput(filter.subjectRF);
        filterOfYear.addSelectedValues(filter.subjectRF);
      }
    }
  }
  
}
