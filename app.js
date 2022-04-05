const [WIDTH, HEIGHT] = [1300, 700]
const COMPONENT_RANGE = [0, 100]
const COMPONENT_NAMES = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('')

const SPACING = {
    between: 30,
    floating: 10,
    width: 100,
    maxHeight: HEIGHT*0.75
}

function main() {
    setup()

    const data = mkData(5, 5)
    console.log('data', data)

    mkChart(data)
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

    return { components, data, maxs }
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
    const scale = SPACING.maxHeight / data.maxs.total
    const xStart = (WIDTH - data.data.length * (SPACING.between + SPACING.width)) / 2

    d3.select('#bars').selectAll('g')
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
                        .attr('x', x)
                        .attr('y', currY)
                        .attr('fill', d3.schemeCategory10[idx])
                        .attr('width', SPACING.width)
                        .attr('height', value)
                })


            })

}
// Make normal stacked barchart
// Floating mode

main()