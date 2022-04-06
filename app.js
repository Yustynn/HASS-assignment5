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
const TRANSITION_DURATION = 500

const state = {
    data: null,
    numBars: 3,
    numComponents: 3,
}


function main() {
    setup()

    setData()
    mkLegend()
    mkChart()
    
    addControls()
}

function addControls() {
    const sel = d3.select('#controls')

    sel.append('button')
        .attr('id', 'sink')
        .text('Sink')
        .on('click', () => sink())

    sel.append('button')
        .attr('id', 'float')
        .text('Float')
        .on('click', () => float())

    sel.append('button')
        .attr('id', 'reroll')
        .text('Reroll')
        .on('click', () => {
            setData()
            mkLegend()
            mkChart()
        })


    sel.select('.num-bars input')
        .on('change', e => {
            state.numBars = +e.target.value
            setData()
            mkLegend()
            mkChart()

            sel.select('.num-bars p').text(`Num Bars: ${state.numBars}`)
        })

    sel.select('.num-components input')
        .on('change', e => {
            state.numComponents = +e.target.value
            setData()
            mkLegend()
            mkChart()

            sel.select('.num-components p').text(`Num Components: ${state.numComponents}`)
        })


}

function float() {
    const { data } = state
    const scale = SPACING.maxHeight / (data.maxs.total + SPACING.floating * data.components.length)
    const t = d3.transition().duration(TRANSITION_DURATION)

    // bar
    d3.selectAll('.bar')
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

function sink() {
    const { data } = state
    const scale = SPACING.maxHeight / (data.maxs.total + SPACING.floating * data.components.length)
    const t = d3.transition().duration(TRANSITION_DURATION)

    d3.selectAll('.bar')
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



function mkLegend() {
    const R = 10
    const x = WIDTH - 100
    const { data } = state 

    d3.select('#legends').remove()

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

function setData() {
    const { numBars, numComponents } = state
    const unsortedData = []
    const maxs = {}
    const components = COMPONENT_NAMES.slice(0, numComponents)

    for (let i = 0; i < numBars; i++) {
        let total = 0
        const datum = {}

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
        
        unsortedData.push(datum)
    }
    
    const data = unsortedData
        .sort((a, b) => b.total - a.total)
        .map((d, i) => ({...d, key: i}))

    state.data = {
        components,
        data,
        maxs
    }
}



function setup() {
    const svg = d3.select('#svg-container').append('svg')
        .attr('width', WIDTH)
        .attr('height', HEIGHT)
        .attr('viewbox', [0, 0, WIDTH, HEIGHT])

    svg.append('g').attr('id', 'bars')

    d3.select('#controls .num-bars p').text(`Num Bars: ${state.numBars}`)
    d3.select('#controls .num-components p').text(`Num Components: ${state.numComponents}`)
}

function mkChart() {
    const { data } = state
    const scale = SPACING.maxHeight / (data.maxs.total + SPACING.floating * data.components.length)
    const xStart = (WIDTH - data.data.length * (SPACING.between + SPACING.width)) / 2
    const t = d3.transition().duration(TRANSITION_DURATION)

    let count = 0
    d3.select('#bars').selectAll('g').remove()
    d3.select('#bars').selectAll('g')
        .data(data.data, d => d.key)
        .join(
            enter => {
                enter.append('g')
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
                                .attr('opacity', 0)
                                .transition(t)
                                .attr('opacity', 1)
                        })
                    })
            },
            update => {
                update.each(function(entries, idx) {
                    const x = xStart + idx * (SPACING.width + SPACING.between)
                    let currY = HEIGHT
                    console.log(entries)


                    data.components.forEach((component, idx) => {
                        const value = entries[component] * scale
                        currY -= value

                        d3.select(this).selectAll('.' + component)
                            .join(
                                enter => {
                                    enter.append('rect')
                                        .classed(component, true)
                                        .transition(t)
                                        .attr('x', x)
                                        .attr('y', currY)
                                        .attr('fill', COLOR_SCALE[idx])
                                        .attr('width', SPACING.width)
                                        .attr('height', value)
                                },
                                update => {
                                    update
                                        .transition(t)
                                        .attr('x', x)
                                        .attr('y', currY)
                                        .attr('fill', COLOR_SCALE[idx])
                                        .attr('width', SPACING.width)
                                        .attr('height', value)
                                },
                                exit => {
                                    exit
                                        .attr('opacity', 1)
                                        .transition(t)
                                        .attr('opacity', 0)
                                        .remove()
                                }
                            )
                    })
                })
            },
            exit => {
                exit
                    .attr('opacity', 1)
                    .transition(t)
                    .attr('opacity', 0)
                    .attr('y', 0)
                    .remove()
            }
        )
}
// Make normal stacked barchart
// Floating mode

main()