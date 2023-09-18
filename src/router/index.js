const process = require('./processRoutes')
const details = require('./detailsRoutes')

function registerRoutes(app) {
	process.registerProcessRoutes(app)
	details.registerDetailsRoutes(app)
}

module.exports = { registerRoutes }
