require('dotenv').config()
const serverless = require('serverless-http')
const express = require('express')

const { registerRoutes } = require('./src/router')
const app = express()

app.get('/', (req, res, next) => {
	return res.status(200).json({
		message: 'Hello from root!'
	})
})

//registering app routes
registerRoutes(app)

app.use((req, res, next) => {
	return res.status(404).json({
		error: 'Not Found'
	})
})


app.listen(3000, (err) => {
	if (err) {
		console.error('Error while starting server!')
	} else {
		console.log('Server started successfully!')
		const registeredRoutes = app._router.stack
			.filter((layer) => layer.route)
			.map((layer) => ({
				route: layer.route.path,
				method: layer.route.stack[0].method
			}))

		console.log('Registered Routes:', registeredRoutes)
	}
})

module.exports.handler = serverless(app)
