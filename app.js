const [WIDTH, HEIGHT] = [1300, 700]
const COMPONENT_RANGE = [0, 100]
const COMPONENT_NAMES = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('')

function main() {
    setup()

    const data = mkData(3, 3)
}

function mkData(numBars = 3, numComponents = 3) {
    const result = {
        data: [],
        components: COMPONENT_NAMES.slice(0, numComponents),
        maxs: {},
    }
    for (let i = 0; i < numBars; i++) {
        const datum = {}
        for (let j = 0; j < numComponents; j++) {
            const interval = COMPONENT_RANGE[1] - COMPONENT_RANGE[0]
            const component = COMPONENT_NAMES[j]
            const value = Math.round(Math.random() * interval + COMPONENT_RANGE[0])
            
            if (result.maxs[component] == undefined) result.maxs[component] = value
            else result.maxs[component] = Math.max(result.maxs[component], value)

            datum[component] = value
        }
        result.data.push(datum)
    }

    return result
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