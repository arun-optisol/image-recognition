const { deleteFile, buildResponseFromPromises } = require('../utils/util')
const rekognitionService = require('../services/rekognition')
const processDB = require('../db/process')

const processController = {}

/**
 *
 * @param {*} req express request
 * @param {*} res express response
 */
processController.processImmediate = async (req, res, next) => {
	try {
		if (!req.files || !req.files.length) {
			res.status(400).send('No files detected.')
			return
		}
		if (req.files.length > 10) {
			res.status(400).send(
				'Upto 10 file is allowed in immediate process. Received more than 10.'
			)
			return
		}
		let promises = req.files.map((file) =>
			rekognitionService.getLabels(file.path)
		)
		let outputPromises = await Promise.allSettled(promises)
		console.log('OUTPUT:::', JSON.stringify(outputPromises, null, 2))
		let now = new Date()
		now.setHours(now.getHours() + 1)
		let { response, dbEntries } = buildResponseFromPromises(
			req.files,
			outputPromises,
			now
		)
		if (dbEntries && dbEntries.length)
			await processDB.insertMultipleLabels(dbEntries)
		res.status(200).send(response)
	} catch (error) {
		console.error(error)
		res.status(500).send('Internal server error')
	} finally {
		if (req.files && req.files.length)
			req.files.forEach((file) => deleteFile(file.path))
	}
}
/**
 *
 * @param {*} req express request
 * @param {*} res express response
 */
processController.processBatch = async (req, res) => {
	try {
		if (req.files || req.files.length) {
			res.status(400).send('No files detected.')
			return
		}
		if (req.files.length > 100) {
			res.status(400).send(
				'Upto one file is allowed in immediate process. Received more than 100.'
			)
			return
		}
	} catch (error) {}
}

module.exports = processController
