/* eslint-disable */
import '../sass/chart.sass'

var pieData = [
        { name: '0-20', value: 32 },
        { name: '21-40', value: 45 },
        { name: '41-60', value: 17 },
        { name: '61 и более', value: 6 },
    ],
    lineData = [
        { name: 'Услышал по радио', value: 12 },
        { name: 'Видел объявление в газете', value: 5 },
        { name: 'Нашел в интернете', value: 50 },
        { name: 'Слышал от других людей', value: 14 },
    ]

writeChart(lineData, '.chart2', 'gorizGist')
writeChart(lineData, '.chart3', 'vertGist')
writeChart(pieData, '.chart', 'pie')

// цвета
function getColors(i) {
    var colors = ['#E94335', '#4385F6', '#32A653', '#F8BC04']
    // colors d3 https://github.com/d3/d3-scale-chromatic/blob/v2.0.0/README.md
    return d3.schemeSet3[i]
}

// 3 графика vertGist, gorizGist, pie
function writeChart(value, elem, type) {
    var data = value,
        svgWidth = 300,
        svgHeight = 220,
        barMargin = 10,
        axisColor = 'rgba(196, 196, 196, 1.0)' // серый цвет для осей

    var dataValue = data.map(i => i.value), // массив только value
        maxValue = d3.max(dataValue) // максимальное value

    // инит svg
    var svg = d3
        .select(elem)
        .append('svg')
        .attr('class', type === 'pie' ? 'ch-chart_svgPie' : 'ch-chart_svgLine')
        .attr('width', type === 'pie' ? svgHeight : svgWidth)
        .attr('height', svgHeight)

    // TITLE: вертикальный график
    if (type === 'vertGist') {
        // вичисляем ширину бара от ширины svg
        var barWidth = (svgWidth - barMargin * 6) / data.length - barMargin,
            // процентное отношение значения к высоте svg
            percentValue = (svgHeight - barMargin * 3) / maxValue

        console.log(barWidth)

        var bar = svg
            .selectAll('g')
            .data(data)
            .enter()
            .append('g')
            .attr('transform', function (d, i) {
                var topMargin =
                        svgHeight - d.value * percentValue - barMargin * 2,
                    leftMargin = i * (barWidth + barMargin) + barMargin * 5

                return 'translate(' + leftMargin + ', ' + topMargin + ')'
            })

        bar.append('rect')
            .attr('width', barWidth)
            .attr('height', function (d) {
                return d.value * percentValue
            })
            .attr('fill', function (d, i) {
                return getColors(i)
            })
        bar.append('text')
            .text(function (d) {
                return d.value
            })
            .attr('x', barWidth / 2)
            .attr('y', function (d) {
                return d.value * percentValue - barMargin
            })
            .attr('text-anchor', 'middle')
            .style('font-size', 13)
            .style('font-weight', 600)

        var yAxes = d3
            .scaleLinear()
            .domain([maxValue, 0])
            .range([0, svgHeight - barMargin * 3])

        svg.append('g')
            .attr('class', 'ch-chart_g')
            .attr(
                'transform',
                'translate(' + barMargin * 3 + ',' + barMargin + ')'
            )
            .call(d3.axisLeft(yAxes))
        // удаляем 0
        svg.selectAll('.tick').filter(':last-child').remove()
    } else if (type === 'gorizGist') {
        // TITLE: горизонтальный график
        var barHeight = 24,
            svgHeight = (barHeight + barMargin) * data.length + barMargin * 3,
            scaleFactor = svgWidth / maxValue / 1.2

        svg.attr('height', svgHeight)

        var bar = svg
            .selectAll('g')
            .data(dataValue)
            .enter()
            .append('g')
            .attr('transform', function (d, i) {
                return (
                    'translate(' +
                    barMargin * 2 +
                    ',' +
                    (i * (barHeight + barMargin) + barMargin) +
                    ')'
                )
            })
        bar.append('rect')
            .attr('width', function (d) {
                return d * scaleFactor
            })
            .attr('height', barHeight)
            .style('fill', function (d, i) {
                return getColors(i)
            })

        bar.append('text')
            .attr('x', 10)
            .attr('y', barHeight / 2 + 5)
            .style('font-size', 13)
            .style('font-weight', 600)
            .text(function (d) {
                return d
            })

        // ширина нижней оси
        var scaleWidth = maxValue * scaleFactor
        var xScale = d3
            .scaleLinear()
            .domain([0, maxValue])
            .range([0, scaleWidth])

        var xAxis = d3.axisBottom().scale(xScale)

        //отступ снизу
        var xAxisMargin = svgHeight - barMargin * 2
        svg.append('g')
            .attr('class', 'ch-chart_g')
            .attr(
                'transform',
                'translate(' + barMargin + ', ' + xAxisMargin + ')'
            )
            .call(xAxis)

        // удаляем 0
        svg.select('.ch-chart_g').select('.tick').remove()
    } else if (type === 'pie') {
        // TITLE: радиальный график
        var arc = d3
            .arc()
            .outerRadius(svgHeight / 2)
            .innerRadius(0)
        var pie = d3
            .pie()
            .sort(null)
            .value(function (d) {
                return d.value
            })
        svg.selectAll('g')
            .data(pie(data))
            .enter()
            .append('g')
            .attr(
                'transform',
                'translate(' + svgHeight / 2 + ',' + svgHeight / 2 + ')'
            )

        svg.selectAll('g')
            .append('path')
            .attr('d', arc)
            .style('fill', function (d, i) {
                return getColors(i)
            })
            .style('stroke', '#ffffff')
            .style('stroke-width', '2px')
    }

    // линии осей
    if (type === 'gorizGist' || type === 'vertGist') {
        var leftLineMarg = type === 'gorizGist' ? barMargin * 2 : barMargin * 3
        // линия слева
        svg.append('line')
            .attr('x1', leftLineMarg)
            .attr('x2', leftLineMarg)
            .attr('y1', 0)
            .attr('y2', svgHeight)
            .style('stroke', axisColor)
            .style('stroke-width', 1)

        // линия снизу
        svg.append('line')
            .attr('x1', 0)
            .attr('x2', svgWidth)
            .attr('y1', svgHeight - barMargin * 2)
            .attr('y2', svgHeight - barMargin * 2)
            .style('stroke', axisColor)
            .style('stroke-width', 1)
        // удаляем линию оси, меняем цвета у осей
        svg.select('.domain').remove()
        svg.selectAll('.tick').select('line').attr('stroke', axisColor)
        svg.selectAll('.tick')
            .select('text')
            .style('font-size', 12)
            .attr('fill', axisColor)
    }

    function getLegendValue(d) {
        if (type === 'pie') {
            var allValue = data.reduce(
                    (sum, current) => sum + current.value,
                    0
                ),
                persent = Math.round((d.value / allValue) * 100)
            return persent + '%'
        } else return d.value
    }
    // legends
    d3.select(elem)
        .selectAll('.ch-chart_legends')
        .data(data)
        .enter()
        .append('div')
        .html(
            (d, i) =>
                '<div class="ch-chart_legend"><span class="ch-chart_legendTag" style="background: ' +
                getColors(i) +
                '"></span>' +
                d.name +
                ' <span class="ch-chart_legendPerc">(' +
                getLegendValue(d) +
                ')</span></div>'
        )
}
