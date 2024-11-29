const columnChart = Object.create(barChart);

columnChart.recalculateLeftMargin = function () {
  var yAxisLabelsWidth = this.yAxis[0].labelGroup.getBBox().width;
  const isSmall = yAxisLabelsWidth < 15 && isZoomed;
  const isBig = yAxisLabelsWidth > 60 && isZoomed;
  const value = isSmall ? 35 : isBig ? 0 : 30;
  var newMarginLeft = yAxisLabelsWidth + value;

  this.update({
    chart: {
      marginLeft: newMarginLeft,
    },
  });
};
