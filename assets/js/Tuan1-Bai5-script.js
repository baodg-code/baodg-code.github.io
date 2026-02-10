(function () {
  "use strict";

  const canvas = document.getElementById("barChart");
  if (!canvas || !window.chartData) return;

  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;

  const cssWidth = canvas.width;
  const cssHeight = canvas.height;
  canvas.width = Math.round(cssWidth * dpr);
  canvas.height = Math.round(cssHeight * dpr);
  canvas.style.width = cssWidth + "px";
  canvas.style.height = cssHeight + "px";
  ctx.scale(dpr, dpr);

  const data = window.chartData;

  const padding = {
    top: 58,
    right: 92,
    bottom: 55,
    left: 76
  };

  const innerWidth = cssWidth - padding.left - padding.right;
  const innerHeight = cssHeight - padding.top - padding.bottom;
  const originX = padding.left;
  const originY = cssHeight - padding.bottom;
  console.log(innerWidth, innerHeight, originX, originY);

  function clear() {
    ctx.fillStyle = data.colors.background;
    ctx.fillRect(0, 0, cssWidth, cssHeight);
  }



  function drawTitle() {
    ctx.fillStyle = data.colors.text;
    ctx.font = " 18px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(data.title, cssWidth / 2 -2, 4);
  }

  function drawAxes() {
    ctx.strokeStyle = data.colors.axis;
    ctx.beginPath();
    ctx.moveTo(originX, originY);  
    ctx.lineTo(cssWidth - padding.right +24, originY);
    ctx.stroke();

    ctx.fillStyle = data.colors.italic_text;
    ctx.font = "italic 14px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(data.xAxisLabel, originX + innerWidth / 2 +13, cssHeight - padding.bottom + 38);

    ctx.save();
    ctx.translate(18, padding.top + innerHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.font = "italic 14px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(data.yAxisLabel, -3 , -13);
    ctx.restore();
  }

  function drawGrid() {
    const maxValue = data.maxValue;
    const step = data.gridStep;
    const count = Math.floor(maxValue / step);

    ctx.strokeStyle = data.colors.grid;
    ctx.fillStyle = data.colors.text;
    ctx.font = "10px Arial";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";

    for (let i = 0; i <= count; i += 1) {
      const value = i * step;
      const y = originY - (value / maxValue) * innerHeight;

      ctx.beginPath();
      ctx.moveTo(originX, y);
      ctx.lineTo(cssWidth - padding.right + 24, y);
      ctx.stroke();

      ctx.fillText(String(value), originX -15, y+2);
    }
  }

  function drawBars() {
    const barCount = data.bars.length;
    if (barCount === 0) return;

    const gap = 24;
    const barWidth = 36;

    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.font = "10px Arial";

    data.bars.forEach((bar, index) => {
      const x = originX + index * (barWidth + gap);
      const height = (bar.value / data.maxValue) * innerHeight;
      const y = originY - height;
      const color =  data.colors.bars;

      ctx.fillStyle = color;
      ctx.fillRect(x, y, barWidth, height);

      ctx.fillStyle = data.colors.text;
      ctx.fillText(bar.label, x + barWidth / 2 -3, originY +6);

     
    });
  }

  function drawLegend() {
    const legend = data.legend;
    if (!legend) return;

    const startX = cssWidth - padding.right +34;
    const startY = padding.top + 24;

    ctx.fillStyle = data.colors.text;
    ctx.font = "12px Arial";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    const lines = String(legend.label || "").trim().split(/\s+/).filter(Boolean);
    lines.forEach((line, index) => {
      ctx.fillText(line, startX, startY + index * 20);
    });

    if (legend.color) {
      ctx.fillStyle = legend.color;
      ctx.fillRect(startX, startY - 24, 36, 15);
    }

 
  }

  clear();
  drawGrid();
  drawAxes();
  drawBars();
  drawLegend();
  drawTitle();
})();
