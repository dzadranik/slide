$(function () {
    function createChart(idPlace, idLegend, data, dataLegend, dataTitle) {
        var dataset = data,
            pie = d3.pie(),
            color = d3.scaleOrdinal(d3.schemeCategory10),
            w = 300,
            h = 300,
            center = w / 2,
            outerRadius = 135,
            innerRadius = 0,
            // внутренние acr радиус
            arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius),
            // внешние цветные arc
            arcOutter = d3
                .arc()
                .innerRadius(outerRadius)
                .outerRadius(outerRadius + 5),
            // arc для hover
            arcOutter2 = d3
                .arc()
                .innerRadius(outerRadius + 5)
                .outerRadius(outerRadius + 12)
        // легенды
        var divLegend = d3.select(idLegend),
            keysLegend = dataLegend,
            colorLegend = d3.scaleOrdinal(d3.schemeCategory10)

        // График
        var svg = d3
            .select(idPlace)
            .append('svg')
            .attr('width', w)
            .attr('height', h)

        var arcs = svg
            .selectAll('g.arc')
            .data(pie(dataset))
            .enter()
            .append('g')
            .attr('class', 'arc')
            .attr('transform', function () {
                return 'translate(' + center + ', ' + center + ')'
            })
            .attr('data-title', function (d, i) {
                return keysLegend[i] + ' (' + d.value + '%)'
            })
            .attr('data-text', function (d) {
                let txt = 'жалоб'
                if (d.value === 1) txt = 'жалоба'
                if (d.value === 2 || d.value === 3 || d.value === 4)
                    txt = 'жалобы'
                return dataTitle + ' ' + d.value + ' ' + txt
            })

        // серый основной радиус
        arcs.append('path')
            .attr('fill', '#eaeaea')
            .attr('d', arc)
            .style('stroke', 'white')
            .style('stroke-width', 3)
        // внешний цветной радиус
        arcs.append('path')
            .attr('fill', function (d, i) {
                return color(i)
            })
            .attr('d', arcOutter)
        // внешний радиус для ховер
        arcs.append('path')
            .attr('fill', function (d, i) {
                return color(i)
            })
            .attr('d', arcOutter2)
            .attr('opacity', 0)
            .attr('class', 'arc-hover')

        // текст на графике
        arcs.append('text')
            .attr('transform', function (d) {
                return 'translate(' + arc.centroid(d) + ')'
            })
            .attr('text-anchor', 'middle')
            .text(function (d) {
                if (d.endAngle - d.startAngle < 0.5) {
                    return ''
                }
                return d.value + '%'
            })
            .attr('class', 'chart-txt')

        // Легенда
        var listLegend = divLegend.append('ul')
        var entriesLegend = listLegend
            .selectAll('li')
            .data(dataLegend)
            .enter()
            .append('li')

        entriesLegend
            .append('span')
            .attr('class', 'legend-dot')
            .style('background-color', function (d) {
                return colorLegend(d)
            })
        var entriesLegendTT = entriesLegend.append('span').attr('class', 'text')
        entriesLegendTT
            .append('span')
            .attr('class', 'label')
            .html(function (d) {
                return d
            })
        entriesLegendTT
            .append('span')
            .data(dataset)
            .attr('class', 'count')
            .html(function (d) {
                return ' (' + d + '%)'
            })

        $('.arc').hover(
            function (e) {
                $(e.currentTarget).addClass('is-hover')

                // текст для хинта
                let title = $(e.currentTarget).data('title'),
                    text = $(e.currentTarget).data('text')

                // цвет для хинта
                let borderColor = $(e.currentTarget)
                    .find('.arc-hover')
                    .css('fill')

                // ширина text
                let chartText = document.querySelector('.arc.is-hover text'),
                    textWidth = chartText.getBBox().width / 2

                // позиция text
                let pos = $(e.currentTarget).find('.chart-txt').position()

                // html хинта
                $(idPlace).append(
                    `<div class="chr-hint js-chartHint">
                        <div class="chr-hint_title">${title}</div>
                        <div class=" class="chr-hint_text">${text}</div>
                        <svg class="chr-hint_arrow" width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.5833 0.700012L5.98319 7.20001L1.38325 0.700018L5.98325 0.700015L10.5833 0.700012Z" fill="white" stroke="white"/>
                            <path d="M1 1L6 8L11 1"/> 
                        </svg>
                    </div>`
                )
                $('.chr-hint').css(pos).css({
                    borderColor: borderColor,
                    stroke: borderColor,
                    marginLeft: textWidth,
                })
            },
            function (e) {
                // отловим ховер на хинт
                let isHint =
                    $(e.relatedTarget).hasClass('js-chartHint') ||
                    $(e.relatedTarget).parents('.js-chartHint').length !== 0
                if (!isHint) {
                    $('.js-chartHint').remove()
                    $('.arc.is-hover').removeClass('is-hover')
                } else {
                    $(e.relatedTarget).hover(null, function () {
                        $('.js-chartHint').remove()
                        $('.arc.is-hover').removeClass('is-hover')
                    })
                }
            }
        )
    }

    var chartCount = 1

    $('.onechart').each(function () {
        createChart(
            '#chart' + chartCount,
            '#chartlegend' + chartCount,
            $(this).data('chart'),
            $(this).data('chartlegend'),
            $(this).data('chartTitle')
        )
        chartCount++
    })
})
