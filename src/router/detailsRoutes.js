const router = require('express').Router()

const detailsController = require('../controllers/detailsController')

function registerDetailsRoutes(app) {
	router.get('/', detailsController.getImagesByCategory)
	router.get('/:id', detailsController.getImagesDetailsById)

	//adding routes to app
	app.use('/image', router)
}

module.exports = { registerDetailsRoutes }
