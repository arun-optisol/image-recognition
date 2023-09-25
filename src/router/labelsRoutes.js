const router = require('express').Router()

const labelsController = require('../controllers/labelsController')

function registerLabelsRoutes(app) {
	router.get('/search', labelsController.getLabelsByCategory)
	router.get('/by-id', labelsController.getLabelsDetailsById)

	//adding routes to app
	app.use('/image', router)
}

module.exports = { registerLabelsRoutes }
