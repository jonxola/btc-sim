import { getPrices } from './prices.js';
import { orderForm } from './order-form.js';
import colors from './colors.js';
import { formatUsd, formatDate } from './util.js';

// adopt the line chart defaults
Chart.defaults.scrubber = Chart.defaults.line;
// add a custom drawing function
Chart.controllers.scrubber = Chart.controllers.line.extend({
    draw(ease) {
        // do everything the default line chart does
        Chart.controllers.line.prototype.draw.call(this, ease);
        // get tooltip's data point
        const dataPoint = getActivePoint();
        if (dataPoint) {
            const { ctx } = this.chart;
            const { top, bottom } = this.chart.chartArea;
            const { x } = dataPoint.tooltipPosition();
            // draw vertical line at active point
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x, top);
            ctx.lineTo(x, bottom);
            ctx.lineWidth = 1;
            ctx.strokeStyle = colors.lightGold;
            ctx.setLineDash([5, 10]);
            ctx.stroke();
            ctx.restore();
        }
    }
});

// chart options
const options = {
    legend: {
        display: false
    },
    tooltips: {
        intersect: false,
        mode: 'nearest',
        axis: 'x',
        titleFontColor: colors.gold,
        custom(tooltip) {
            if (!tooltip) return;
            tooltip.displayColors = false;
        },
        callbacks: {
            title([tooltip]) {
                return formatDate(tooltip.label);
            },
            label(tooltip) {
                return formatUsd(tooltip.value);
            }
        }
    },
    scales: {
        xAxes: [{
            id: 'date',
            type: 'time',
            gridLines: {
                display: false
            },
            ticks: {
                fontColor: colors.light
            }
        }],
        yAxes: [{
            id: 'price',
            type: 'linear',
            ticks: {
                fontColor: colors.light,
                callback(value) {
                    return new Intl.NumberFormat('en-US', {
                        style: 'currency', currency: 'USD', minimumFractionDigits: 0
                    }).format(value);
                }
            }
        }]
    },
    annotation: {
        annotations: []
    },
    onClick() {
        const dataPoint = getActivePoint();
        if (dataPoint) {
            const date = this.chart.data.labels[dataPoint._index];
            orderForm.autofillDate(date);
        }
    }
}

// canvas
const canvas = document.querySelector('.chart');
const ctx = canvas.getContext('2d');

// fill gradient
const gradient = ctx.createLinearGradient(0, 0, 0, 600);
gradient.addColorStop(0, colors.gold);
gradient.addColorStop(1, colors.none);

// dataset style
const dataStyle = {
    lineTension: 0,
    backgroundColor: gradient,
    borderColor: colors.gold,
    borderWidth: 1.5,
    pointRadius: 0
};

// create chart
const priceChart = new Chart(canvas, {
    type: 'scrubber',
    options,
    data: {
        datasets: [{
            ...dataStyle
        }]
    }
});

// units by time range
const rangeUnit = { 'max': 'year', '5y': 'year', '1y': 'month', '6m': 'month', '1m': 'day', '1w': 'day' };

// get the tooltip's active data point
function getActivePoint() {
    return priceChart.tooltip._active && priceChart.tooltip._active.length
        ? priceChart.tooltip._active[0]
        : null;
}

// change time range
function setRange(range) {
    priceChart.data.labels = Object.keys(getPrices(range));
    priceChart.data.datasets[0].data = Object.values(getPrices(range));
    priceChart.options.scales.xAxes[0].time.minUnit = rangeUnit[range];
    priceChart.update(0);
}

// toggle between linear & logarithmic price scale
function setScale(type) {
    priceChart.options.scales.yAxes[0].type = type;
    priceChart.update(0);
}

// draw line at each order date
function showOrders(orders) {
    priceChart.options.annotation.annotations = orders.map(order => ({
        type: 'line',
        scaleID: 'date',
        value: order.date,
        borderColor: colors.lightGold,
        borderWidth: 1,
        borderDash: [5, 10]
    }));
    priceChart.update();
}

export {
    setRange,
    setScale,
    showOrders
};