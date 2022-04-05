const [WIDTH, HEIGHT] = [1300, 700]
const COMPONENT_RANGE = [0, 100]
const COMPONENT_NAMES = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('')

const SPACING = {
    between: 30,
    floating: 10
}

function main() {
    setup()

    const data = mkData(3, 3)
    console.log('data', data)
}

function mkData(numBars = 3, numComponents = 3) {
    const data = []
    const maxs = {}
    const components = COMPONENT_NAMES.slice(0, numComponents)

    for (let i = 0; i < numBars; i++) {
        const datum = {}
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
    d3.select('#svg-container').append('svg')
        .attr('width', WIDTH)
        .attr('height', HEIGHT)
        .attr('viewbox', [0, 0, WIDTH, HEIGHT])
}
// Setup svg
// Make normal stacked barchart
// Floating mode

main()