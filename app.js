const [WIDTH, HEIGHT] = [1300, 700]

// for data gen
const COMPONENT_RANGE = [0, 100]
const COMPONENT_NAMES = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('')

// for theming
const COLOR_SCALE = d3.schemeCategory10
const SPACING = {
    between: 30,
    floating: 20,
    width: 100,
    maxHeight: 0.75*HEIGHT
}
const TRANSITION_DURATION = 1000


function main() {
    setup()

    const data = mkData(5, 3)
    console.log('data', data)

    mkLegend(data)
    const bar = mkChart(data)
    
    addControls(bar, data)
}

function addControls(bar, data) {
    const sel = d3.select('#controls')

    sel.append('button')
        .attr('id', 'sink')
        .text('Sink')
        .on('click', () => sink(bar, data))

    sel.append('button')
        .attr('id', 'float')
        .text('Float')
        .on('click', () => float(bar, data))

}

function float(bar, data) {
    const scale = SPACING.maxHeight / (data.maxs.total + SPACING.floating * data.components.length)
    const t = d3.transition().duration(TRANSITION_DURATION)

    bar
        .each(function(entries) {
            let currY = HEIGHT

            data.components.forEach((component) => {
                const maxValue = data.maxs[component] * scale
                const value = entries[component] * scale
                currY -= value
                d3.select(this).select('.' + component)
                    .transition(t)
                    .attr('y', currY)
                currY +=  value - maxValue - SPACING.floating
            })
        })

}

function sink(bar, data) {
    const scale = SPACING.maxHeight / (data.maxs.total + SPACING.floating * data.components.length)
    const t = d3.transition().duration(TRANSITION_DURATION)

    bar
        .each(function(entries) {
            let currY = HEIGHT

            data.components.forEach((component) => {
                const value = entries[component] * scale
                currY -= value
                d3.select(this).select('.' + component)
                    .transition(t)
                    .attr('y', currY)
            })
        })
}



function mkLegend(data) {
    const R = 10
    const x = WIDTH - 100
    d3.select('svg')
        .append('g')
        .attr('id', 'legends')
        .selectAll('g')
        .data(data.components)
        .join('g')
            .classed('legend', true)
            .each(function(component, idx) {
                const sel = d3.select(this)
                const y = idx * 30 + 10
                sel.append('circle')
                    .attr('fill', COLOR_SCALE[idx])
                    .attr('r', R)
                    .attr('cx', x)
                    .attr('cy', y)
                sel.append('text')
                    .text(component)
                    .attr('fill', COLOR_SCALE[idx])
                    .attr('x', x + 20)
                    .attr('y', y + R/2)
                    .attr('text-anchor', 'center')
            })
}

function mkData(numBars = 3, numComponents = 3) {
    const data = []
    const maxs = {}
    const components = COMPONENT_NAMES.slice(0, numComponents)

    for (let i = 0; i < numBars; i++) {
        const datum = { key: i }
        let total = 0

        for (const component of components) {
            // compute value
            const interval = COMPONENT_RANGE[1] - COMPONENT_RANGE[0]
            const value = Math.round(Math.random() * interval + COMPONENT_RANGE[0])
            
            // update max
            if (maxs[component] == undefined) maxs[component] = value
            else maxs[component] = Math.max(maxs[component], value)

            // set value and update total
            datum[component] = value
            total += value
        }
        datum['total'] = total

        // update max total
        if (maxs['total'] == undefined) maxs['total'] = total
        else maxs['total'] = Math.max(maxs['total'], total)
        
        data.push(datum)
    }
    

    return {
        components,
        data: data.sort((a, b) => b.total - a.total),
        maxs
    }
}



function setup() {
    const svg = d3.select('#svg-container').append('svg')
        .attr('width', WIDTH)
        .attr('height', HEIGHT)
        .attr('viewbox', [0, 0, WIDTH, HEIGHT])

    const bars = svg.append('g').attr('id', 'bars')
}

let count = 0
function mkChart(data) {
    const scale = SPACING.maxHeight / (data.maxs.total + SPACING.floating * data.components.length)
    const xStart = (WIDTH - data.data.length * (SPACING.between + SPACING.width)) / 2

    const bar = d3.select('#bars').selectAll('g')
        .data(data.data, d => d.key)
        .join('g')
            .classed('bar' ,true)
            .attr('id', () => { count++; return count })
            .each(function(entries, idx) {
                const x = xStart + idx * (SPACING.width + SPACING.between)
                let currY = HEIGHT

                data.components.forEach((component, idx) => {
                    const value = entries[component] * scale
                    currY -= value

                    d3.select(this).append('rect')
                        .classed(component, true)
                        .attr('x', x)
                        .attr('y', currY)
                        .attr('fill', COLOR_SCALE[idx])
                        .attr('width', SPACING.width)
                        .attr('height', value)
                })
            })

        return bar

}
// Make normal stacked barchart
// Floating mode

main()