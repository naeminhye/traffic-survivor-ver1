$(function () {
    var col = ['#ff0000', '#00ff00', '#0000ff'],
        color;

    function styleTickLines() {
        var paths = $('.highcharts-axis > path').splice(0),
            len = paths.length;
        // hide first and last
        paths[0].setAttribute('opacity', 0);
        paths[len - 1].setAttribute('opacity', 0);
        // style the rest
        for (var i = 1; i < len - 1; i++) {
            paths[i].setAttribute('stroke-dasharray', '3,3');
        }
    }

    WORLD.chart = Highcharts.chart('speed-gauge', {
        chart: {
            plotBackgroundColor: null,
            plotBackgroundImage: null,
            plotBorderWidth: 0,
            plotShadow: false,
            events: {
                load: styleTickLines,
                redraw: styleTickLines
            }
        },
        title: {
            text: null
        },
        tooltip: {
            enabled: false
        },
        pane: {
            startAngle: -90,
            endAngle: 90,
            background: {
                backgroundColor: '#ccc',
                borderWidth: 0,
                shape: 'arc',
                innerRadius: '60%',
                outerRadius: '100%'
            }
        },
        yAxis: {
            zIndex: 7,
            stops: [
                [1, '#ff0000']
            ],
            min: 0,
            max: 120,
            minorTickLength: 0,
            lineWidth: 0,
            tickPixelInterval: 30,
            tickWidth: 2,
            tickPosition: 'inside',
            tickLength: 46,
            tickColor: '#666',
            tickPositions: [0, 20, 40, 60, 80, 100, 120],
            labels: {
                distance: 20
            }
        },
        series: [{
            type: 'solidgauge',
            fillColor: 'red',
            data: [0],
            radius: '100%',
            dataLabels: {
                y: 10,
                borderWidth: 0,
                style: {
                    fontSize: '20px'
                }
            }
        }, {
            type: 'gauge',
            data: [0],
            pivot: {
                backgroundColor: "#fff",
                borderColor: "#666",
                borderWidth: 5,
                radius: 6
            },
            dataLabels: {
                enabled: false
            },
            dial: {
                radius: '105%',
                backgroundColor: '#666',
                borderWidth: 0,
                baseWidth: 5,
                topWidth: 5,
                baseLength: '100%', // of radius
                rearLength: '0%'
            }
        }]

    }

        // Add some life
    );

    WORLD.setSpeed = (chart, speed) => {
        var point = chart.series[0].points[0],
            point2 = chart.series[1].points[0],
            newVal,
            inc = 0;//Math.round((Math.random()) * 10);

        newVal = speed;//point.y + inc;
        if (newVal < 0 || newVal > 120) {
            newVal = point.y - inc;
        }

        if (newVal < 40) {
            color = col[0];
        } else if (newVal < 80) {
            color = col[1];
        } else {
            color = col[2];
        }
        chart.yAxis[0].update({
            stops: [
                [1, color]
            ]
        }, false);

        point.update(newVal, false);
        point2.update(newVal, false);
        chart.series[0].bindAxes();
        chart.redraw(true);

    }
});