// range for components
const COMPONENT_RANGE = [0, 100]
const COMPONENT_NAMES = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('')

// Make random data generating function
    // Params: Num bars, num components per bar

function mkData(numBars = 3, numComponents = 3) {
    const result = {
        data: [],
        components: COMPONENT_NAMES.slice(0, numComponents)
    }
    for (let i = 0; i < numBars; i++) {
        const datum = {}
        for (let j = 0; j < numComponents; j++) {
            const interval = COMPONENT_RANGE[1] - COMPONENT_RANGE[0]
            datum[COMPONENT_NAMES[j]] = Math.round(Math.random() * interval + COMPONENT_RANGE[0])
        }
        result.data.push(datum)
    }

    return result
}

console.log(mkData(3, 3))

// Setup svg
// Make normal stacked barchart
// Floating mode
