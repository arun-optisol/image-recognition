const router = require('express').Router()

const processController = require('../controllers/processController')
const { fileUploadLimit } = require('../middleware/fileUploadMiddleware')

function registerProcessRoutes(app) {
	router.post(
		'/immediate',
		fileUploadLimit(10),
		processController.processImmediate
	)
	router.post('/batch', fileUploadLimit(100), processController.processBatch)

	//adding routes to app
	app.use('/process', router)
}

module.exports = { registerProcessRoutes }
