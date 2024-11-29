const pieChartWithDrilldown = {
    toggleIsZoom(value) {
        let newValue;
        if(value !== undefined) {
            newValue = value;
        } else {
            let currentValue = JSON.parse(localStorage.getItem('isZoom'));
            currentValue = currentValue === null ? true : !currentValue;
            newValue = currentValue;
        }
        localStorage.setItem('isZoom', JSON.stringify(newValue));
    },
    getIsZoom() {
        const value = localStorage.getItem('isZoom');
        return JSON.parse(value)
    },
    checkEnabledLegendItem(condition) {
        const elem = document.getElementById(w.general.renderTo).querySelectorAll('.highcharts-pie-series.highcharts-legend-item-hidden');
        if (elem.length > 0 || (JSON.parse(localStorage.getItem('widget'))?.selectedValue?.length ?? 0) > 0) { 
           $('#widget-action-' + w.general.renderTo).find('.va-widget-filter-btn').css('display', 'block');
        } else {
          $('#widget-action-' + w.general.renderTo).find('.va-widget-filter-btn').css('display', 'none');
        }
        
        if(isDrill && elem.length <= 0) {
          $('#widget-action-' + w.general.renderTo).find('.va-widget-filter-btn').css('display', 'none');  
        }
    }
}