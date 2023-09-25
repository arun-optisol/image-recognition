const process = require('./processRoutes')
const details = require('./labelsRoutes')

function registerRoutes(app) {
	process.registerProcessRoutes(app)
	details.registerLabelsRoutes(app)
}

module.exports = { registerRoutes }
